import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Redacao } from '../entities/redacao.entity';

@Injectable()
export class DeleteRedacaoService {
  constructor(
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async deleteRedacaoById(userId: string, redacaoId: number): Promise<void> {
    if (!userId) {
      throw new NotFoundException('User not found');
    }

    if (!redacaoId || isNaN(redacaoId)) {
      throw new NotFoundException('Invalid Id');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const redacao: Redacao = await this.redacaoRepository.findOne({
      where: { id: redacaoId, user: { id: userId } },
    });

    if (!redacao) {
      throw new NotFoundException('Redacao not found');
    }

    await this.redacaoRepository.delete({ id: redacaoId });
  }
}
