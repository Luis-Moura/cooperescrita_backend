import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Redacao } from '../../entities/redacao.entity';
import { IGetRedacoes, RedacaoDTO } from '../interfaces/IGetRedacoes';
import { OrderQueryPublicRedacoes } from '../interfaces/OrderQueryPublicRedacoes';
import { OrderQueryPrivateRedacoes } from '../interfaces/OrderQueryPrivateRedacoes';

@Injectable()
export class GetRedacaoService {
  constructor(
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Metodo para buscar redações públicas (somente com status de envio "enviado")
  async getPublicRedacoes(
    userId: string,
    limit: number,
    offset: number,
    orderQuery: OrderQueryPublicRedacoes,
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
    const where: any = { statusEnvio: 'enviado' };

    if (orderQuery.order) {
      if (
        orderQuery.order !== 'crescente' &&
        orderQuery.order !== 'decrescente'
      ) {
        throw new BadRequestException('Invalid order');
      }

      order =
        orderQuery.order === 'crescente'
          ? { createdAt: 'ASC' }
          : { createdAt: 'DESC' };
    }

    if (orderQuery.statusCorrecao) {
      if (
        orderQuery.statusCorrecao !== 'corrigidas' &&
        orderQuery.statusCorrecao !== 'nao-corrigidas'
      ) {
        throw new BadRequestException('Invalid statusCorrecao');
      }

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
      userName: redacao.user.name,
      userId: redacao.user.id,
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

  // Método para buscar apenas redações do usuário logado (qualquer status)
  async getMyRedacoes(
    userId: string,
    limit: number,
    offset: number,
    orderQuery: OrderQueryPrivateRedacoes,
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
      if (
        orderQuery.order !== 'crescente' &&
        orderQuery.order !== 'decrescente'
      ) {
        throw new BadRequestException('Invalid order');
      }

      order =
        orderQuery.order === 'crescente'
          ? { createdAt: 'ASC' }
          : { createdAt: 'DESC' };
    }

    if (orderQuery.statusEnvio) {
      if (
        orderQuery.statusEnvio !== 'enviado' &&
        orderQuery.statusEnvio !== 'rascunho'
      ) {
        throw new BadRequestException('Invalid statusEnvio');
      }

      where.statusEnvio =
        orderQuery.statusEnvio === 'enviado' ? 'enviado' : 'rascunho';
    }

    if (orderQuery.statusCorrecao) {
      if (
        orderQuery.statusCorrecao !== 'corrigidas' &&
        orderQuery.statusCorrecao !== 'nao-corrigidas'
      ) {
        throw new BadRequestException('Invalid statusCorrecao');
      }

      where.statusCorrecao =
        orderQuery.statusCorrecao === 'corrigidas'
          ? 'corrigida'
          : 'nao_corrigida';
    }

    const redacoes: Redacao[] = await this.redacaoRepository.find({
      where: { user: { id: userId }, ...where },
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
      userName: redacao.user.name,
      userId: redacao.user.id,
      content: redacao.content,
      statusEnvio: redacao.statusEnvio,
      statusCorrecao: redacao.statusCorrecao,
      createdAt: redacao.createdAt,
      updatedAt: redacao.updatedAt,
      correcoes: redacao.correcoes,
      comentariosRedacao: redacao.comentariosRedacao,
    }));

    const totalRedacoes = await this.redacaoRepository.count({
      where: { user: { id: userId }, ...where },
    });

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
      relations: ['user'],
    });

    if (!redacao) {
      throw new NotFoundException('Redacao not found');
    }

    // Usuário só pode acessar rascunhos próprios
    if (redacao.statusEnvio === 'rascunho' && redacao.user.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este rascunho',
      );
    }

    return {
      ...redacao,
      userName: redacao.user.name,
      userId: redacao.user.id,
      user: undefined,
    };
  }
}
