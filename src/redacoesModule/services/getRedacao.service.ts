import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Redacao } from '../entities/redacao.entity';
import { IGetRedacoes, RedacaoDTO } from '../interfaces/IGetRedacoes';
import { IOrderQuery } from '../interfaces/IOrderQuery';

@Injectable()
export class GetRedacaoService {
  constructor(
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getRedacoes(
    userId: string,
    limit: number,
    offset: number,
    orderQuery: IOrderQuery,
  ): Promise<IGetRedacoes> {
    if (!userId) {
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
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let order = {};
    const where: any = {};

    if (orderQuery.order) {
      order =
        orderQuery.order === 'crescente'
          ? { createdAt: 'ASC' }
          : { createdAt: 'DESC' };
    }

    if (orderQuery.statusEnvio) {
      where.statusEnvio = orderQuery.statusEnvio;
    }

    if (orderQuery.statusCorrecao) {
      where.statusCorrecao =
        orderQuery.statusCorrecao === 'corrigidas'
          ? 'corrigida'
          : 'nao_corrigida';
    }

    const redacoes: Redacao[] = await this.redacaoRepository.find({
      where,
      order,
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    // Mapeia as redações para retornar somente o nome do usuário
    const redacoesDTO: RedacaoDTO[] = redacoes.map((redacao) => ({
      id: redacao.id,
      title: redacao.title,
      topic: redacao.topic,
      user: redacao.user.name,
      content: redacao.content,
      statusEnvio: redacao.statusEnvio,
      statusCorrecao: redacao.statusCorrecao,
      createdAt: redacao.createdAt,
      updatedAt: redacao.updatedAt,
      correcoes: redacao.correcoes,
      comentariosRedacao: redacao.comentariosRedacao,
    }));

    const totalRedacoes = await this.redacaoRepository.count({ where });

    if (redacoes.length === 0) {
      throw new NotFoundException('Redacoes not found');
    }

    return { redacoes: redacoesDTO, totalRedacoes };
  }

  async getRedacaoById(userId: string, id: number) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const redacao: Redacao = await this.redacaoRepository.findOne({
      where: { id },
    });

    if (!redacao) {
      throw new NotFoundException('Redacao not found');
    }

    return redacao;
  }
}
