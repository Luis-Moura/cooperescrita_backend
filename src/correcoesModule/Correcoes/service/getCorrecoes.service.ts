import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { GetCorrecoesDto } from '../dto/getCorrecoes.dto';

@Injectable()
export class GetCorrecoesService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    // @InjectRepository(Redacao)
    // private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Método para buscar correções públicas (somente com status "enviado")
  async getPublicCorrecoes(
    corretorId: string,
    getCorrecoesDto: GetCorrecoesDto,
  ) {
    const { limit, offset, redacaoId, ordemLancamento, likes } =
      getCorrecoesDto;

    if (!corretorId) {
      throw new NotFoundException('User not found');
    }

    if (
      isNaN(limit) ||
      isNaN(offset) ||
      limit === undefined ||
      offset === undefined
    ) {
      throw new BadRequestException('Invalid limit or offset');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const query = this.correcaoRepository
      .createQueryBuilder('correcao')
      .leftJoin('correcao.redacao', 'redacao')
      .leftJoin('correcao.corretor', 'corretor')
      .select([
        'correcao.correcaoId',
        'correcao.statusEnvio',
        'correcao.createdAt',
        'corretor.id AS corretor_id',
        'corretor.name AS corretor_name',
        'redacao.id AS redacao_id',
        'redacao.title AS redacao_title',
        'redacao.statusEnvio AS redacao_statusEnvio',
      ])
      .leftJoin('correcao.correcaoFeedbacks', 'feedback')
      .addSelect([
        `COALESCE(COUNT(CASE WHEN feedback.feedbackType = 'like' THEN 1 END), 0) AS totalLikes`,
        `COALESCE(COUNT(CASE WHEN feedback.feedbackType = 'dislike' THEN 1 END), 0) AS totalDislikes`,
      ])
      .where('correcao.statusEnvio = :statusEnvio', { statusEnvio: 'enviado' })
      .groupBy('correcao.correcaoId, redacao.id, corretor.id, corretor.name') // Incluindo todas as colunas do corretor
      .limit(limit)
      .offset(offset);

    // Filtro por redação específica, se necessário
    if (redacaoId) {
      query.andWhere('correcao.redacao = :redacaoId', { redacaoId });
    }

    // Definir ordenação (data de criação ou likes)
    if (likes) {
      query.orderBy('totalLikes', likes === 'asc' ? 'ASC' : 'DESC');
    }

    if (ordemLancamento) {
      query.addOrderBy(
        'correcao.createdAt',
        ordemLancamento === 'asc' ? 'ASC' : 'DESC',
      );
    }

    const correcoes = await query.getRawMany();
    const totalCorrecoes = await this.correcaoRepository.count({
      where: { statusEnvio: 'enviado' },
    });

    if (correcoes.length === 0) {
      throw new NotFoundException('Correções públicas não encontradas');
    }

    return {
      correcoes: correcoes.map(this.formatCorrecao),
      totalCorrecoes,
    };
  }

  // Método para buscar apenas correções do corretor logado (qualquer status)
  async getMyCorrecoes(corretorId: string, getCorrecoesDto: GetCorrecoesDto) {
    const { limit, offset, redacaoId, ordemLancamento, likes, statusEnvio } =
      getCorrecoesDto;

    console.log(statusEnvio);

    if (!corretorId) {
      throw new NotFoundException('User not found');
    }

    if (
      isNaN(limit) ||
      isNaN(offset) ||
      limit === undefined ||
      offset === undefined
    ) {
      throw new BadRequestException('Invalid limit or offset');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const query = this.correcaoRepository
      .createQueryBuilder('correcao')
      .leftJoin('correcao.redacao', 'redacao')
      .leftJoin('correcao.corretor', 'corretor')
      .select([
        'correcao.correcaoId',
        'correcao.statusEnvio',
        'correcao.createdAt',
        'corretor.id AS corretor_id',
        'corretor.name AS corretor_name',
        'redacao.id AS redacao_id',
        'redacao.title AS redacao_title',
        'redacao.statusEnvio AS redacao_statusEnvio',
      ])
      .leftJoin('correcao.correcaoFeedbacks', 'feedback')
      .addSelect([
        `COALESCE(COUNT(CASE WHEN feedback.feedbackType = 'like' THEN 1 END), 0) AS totalLikes`,
        `COALESCE(COUNT(CASE WHEN feedback.feedbackType = 'dislike' THEN 1 END), 0) AS totalDislikes`,
      ])
      .where('corretor.id = :corretorId', { corretorId })
      .groupBy('correcao.correcaoId, redacao.id, corretor.id, corretor.name') // Incluindo todas as colunas do corretor
      .limit(limit)
      .offset(offset);

    // Filtro por redação específica, se necessário
    if (redacaoId) {
      query.andWhere('correcao.redacao = :redacaoId', { redacaoId });
    }

    // Definir ordenação (data de criação ou likes)
    if (likes) {
      query.orderBy('totalLikes', likes === 'asc' ? 'ASC' : 'DESC');
    }

    // Filtro por status de envio, se necessário
    if (statusEnvio) {
      query.andWhere('correcao.statusEnvio = :statusEnvio', {
        statusEnvio,
      });
    }

    if (ordemLancamento) {
      query.addOrderBy(
        'correcao.createdAt',
        ordemLancamento === 'asc' ? 'ASC' : 'DESC',
      );
    }

    const correcoes = await query.getRawMany();
    const totalCorrecoes = await this.correcaoRepository.count({
      where: { corretor: { id: corretorId } },
    });

    if (correcoes.length === 0) {
      throw new NotFoundException(
        'Nenhuma correção encontrada para este corretor',
      );
    }

    return {
      correcoes: correcoes.map(this.formatCorrecao),
      totalCorrecoes,
    };
  }

  async getCorrecaoById(userId: string, correcaoId: number) {
    // Verificar se o usuário existe
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Buscar a correção pelo ID
    const correcao = await this.correcaoRepository.findOne({
      where: { correcaoId },
      relations: ['redacao', 'corretor'],
    });

    if (
      correcao.statusEnvio === 'rascunho' &&
      correcao.corretor.id !== userId
    ) {
      throw new NotFoundException('Correcao not found');
    }

    if (!correcao) {
      throw new NotFoundException('Correcao not found');
    }

    return {
      ...correcao,
      corretor: undefined,
      corretorId: correcao.corretor.id,
      corretorName: correcao.corretor.name,
    };
  }

  private formatCorrecao(c: any) {
    return {
      correcao_correcaoId: Number(c.correcao_correcaoId),
      correcao_statusEnvio: c.correcao_statusEnvio,
      correcao_createdAt: c.correcao_createdAt,
      corretor_id: c.corretor_id,
      corretor_name: c.corretor_name,
      redacao_id: Number(c.redacao_id),
      redacao_title: c.redacao_title,
      redacao_statusenvio: c.redacao_statusEnvio,
      totallikes: Number(c.totallikes || c.totalLikes || 0),
      totaldislikes: Number(c.totaldislikes || c.totalDislikes || 0),
    };
  }
}
