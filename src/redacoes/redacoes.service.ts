import { Injectable } from '@nestjs/common';
import { CreateRedacaoDto } from './dto/create-redacao.dto';
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

  async create(redacaoDto: CreateRedacaoDto, userId: string): Promise<Redacao> {
    if (!userId) {
      throw new Error('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const redacao: Redacao = this.redacaoRepository.create({
      ...redacaoDto,
      user: { id: userId },
    });

    return await this.redacaoRepository.save(redacao);
  }

  async getRedacoes(userId: string): Promise<Redacao[]> {
    if (!userId) {
      throw new Error('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const redacoes: Redacao[] = await this.redacaoRepository.find({
      where: { user: { id: userId } },
    });

    if (redacoes.length === 0) {
      throw new Error('Redacoes not found');
    }

    return redacoes;
  }

  async getRedacaoById(userId: string, id: number) {
    if (!userId) {
      throw new Error('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const redacao: Redacao = await this.redacaoRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!redacao) {
      throw new Error('Redacao not found');
    }

    return redacao;
  }

  async getRedacaoByStatus(userId: string, status: 'rascunho' | 'enviado') {
    if (!userId) {
      throw new Error('User not found');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const redacoes: Redacao[] = await this.redacaoRepository.find({
      where: { user: { id: userId }, status: status },
    });

    if (redacoes.length === 0) {
      throw new Error('Redacoes not found');
    }

    return redacoes;
  }
}
