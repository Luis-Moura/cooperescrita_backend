import { Injectable } from '@nestjs/common';
import { CreateRedacaoDto } from './dto/create-redacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from './entities/redacoe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RedacoesService {
  constructor(
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
  ) {}

  async create(redacaoDto: CreateRedacaoDto, userId: string) {
    if (!userId) {
      throw new Error('User not found');
    }

    const redacao = this.redacaoRepository.create({
      ...redacaoDto,
      user: { id: userId },
    });

    return await this.redacaoRepository.save(redacao);
  }
}
