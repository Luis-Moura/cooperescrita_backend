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

  async getCorrecoes(corretorId: string, getCorrecoesDto: GetCorrecoesDto) {
    const { limit, offset, redacaoId, ordemLancamento, likes } =
      getCorrecoesDto;

    // const { limit, offset, redacaoId, ordemLancamento } = getCorrecoesDto;

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
      .select([
        'correcao.correcaoId',
        'correcao.statusEnvio',
        'correcao.createdAt',
        'redacao.id AS redacao_id',
        'redacao.title AS redacao_title',
        'redacao.statusEnvio AS redacao_statusEnvio',
      ])
      .leftJoin('correcao.correcaoFeedbacks', 'feedback')
      .addSelect([
        `COUNT(CASE WHEN feedback.feedbackType = 'like' THEN 1 END) AS totalLikes`,
        `COUNT(CASE WHEN feedback.feedbackType = 'dislike' THEN 1 END) AS totalDislikes`,
      ])
      .groupBy('correcao.correcaoId, redacao.id')
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

    const correcoes = await query.getRawMany(); // Buscar os resultados
    const totalCorrecoes = await this.correcaoRepository.count({
      where: { corretor: { id: corretorId } },
    });

    if (correcoes.length === 0) {
      throw new NotFoundException('Correcoes not found');
    }

    return { correcoes, totalCorrecoes };
  }

  getCorrecaoById(corretorId: string, id: number) {
    // Verificar se o usuário existe
    if (!corretorId) {
      throw new NotFoundException('User not found');
    }

    const corretor = this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) {
      throw new NotFoundException('User not found');
    }

    // Buscar a correção pelo ID
    const correcao = this.correcaoRepository.findOne({
      where: { correcaoId: id },
      relations: ['redacao'],
    });

    if (!correcao) {
      throw new NotFoundException('Correcao not found');
    }

    return correcao;
  }
}
