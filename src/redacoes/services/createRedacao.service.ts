import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { createDefinitiveRedacaoDto } from '../dto/createDefinitiveRedacaoDto';
import { createDraftRedacaoDto } from '../dto/createDraftRedacaoDto';
import { Redacao } from '../entities/redacao.entity';

@Injectable()
export class CreateRedacaoService {
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

      redacao = this.redacaoRepository.merge(redacao, redacaoDto);
    } else {
      redacao = this.redacaoRepository.create({
        ...redacaoDto,
        statusEnvio: 'rascunho',
        user: { id: userId },
      });
    }

    try {
      return await this.redacaoRepository.save(redacao);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
