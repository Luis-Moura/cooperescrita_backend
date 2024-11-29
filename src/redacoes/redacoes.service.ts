import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { createDefinitiveRedacaoDto } from './dto/createDefinitiveRedacaoDto';
import { Redacao } from './entities/redacao.entity';
import { IOrderQuery } from './interfaces/IOrderQuery';
import { createDraftRedacaoDto } from './dto/createDraftRedacaoDto';

@Injectable()
export class RedacoesService {
  constructor(
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createDefinitiveRedacao(
    redacaoDto: createDefinitiveRedacaoDto,
    userId: string,
    redacaoId?: number,
  ): Promise<Redacao> {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let redacao: Redacao;

    if (redacaoId) {
      redacao = await this.redacaoRepository.findOne({
        where: { id: redacaoId, user: { id: userId } },
      });

      if (!redacao) {
        throw new NotFoundException('Redacao not found');
      }

      if (redacao.statusEnvio === 'enviado') {
        throw new BadRequestException('Redacao already sent');
      }

      redacao = this.redacaoRepository.merge(redacao, redacaoDto, {
        statusEnvio: 'enviado',
      });
    } else {
      redacao = this.redacaoRepository.create({
        ...redacaoDto,
        statusEnvio: 'enviado',
        user: { id: userId },
      });
    }

    try {
      return await this.redacaoRepository.save(redacao);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createDraft(
    userId: string,
    redacaoDto: createDraftRedacaoDto,
  ): Promise<Redacao> {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const redacao: Redacao = this.redacaoRepository.create({
      ...redacaoDto,
      statusEnvio: 'rascunho',
      user: { id: userId },
    });

    try {
      return await this.redacaoRepository.save(redacao);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getRedacoes(
    userId: string,
    limit: number,
    offset: number,
    orderQuery: IOrderQuery,
  ): Promise<Redacao[]> {
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
    const where: any = { user: { id: userId } };

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
    });

    if (redacoes.length === 0) {
      throw new NotFoundException('Redacoes not found');
    }

    return redacoes;
  }

  async getRedacaoById(userId: string, id: number) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid id');
    }

    const redacao: Redacao = await this.redacaoRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!redacao) {
      throw new NotFoundException('Redacao not found');
    }

    return redacao;
  }
}
