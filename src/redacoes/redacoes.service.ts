import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { createDefinitiveRedacaoDto } from './dto/createDefinitiveRedacaoDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from './entities/redacao.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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
      status: 'enviado',
      user: { id: userId },
    });

    try {
      return await this.redacaoRepository.save(redacao);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // rota de salvar redação como rascunho

  async getRedacoes(userId: string): Promise<Redacao[]> {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const redacoes: Redacao[] = await this.redacaoRepository.find({
      where: { user: { id: userId } },
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

  async getRedacaoByStatus(userId: string, status: 'rascunho' | 'enviado') {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (status !== 'rascunho' && status !== 'enviado') {
      throw new BadRequestException('Invalid status');
    }

    const redacoes: Redacao[] = await this.redacaoRepository.find({
      where: { user: { id: userId }, status: status },
    });

    if (redacoes.length === 0) {
      throw new NotFoundException('Redacoes not found');
    }

    return redacoes;
  }
}
