import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteCorrecoesService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
  ) {}

  async deleteCorrecaoById(corretorId: string, correcaoId: number) {
    // verificar se o corretor existe

    if (!corretorId) {
      throw new NotFoundException('User not found');
    }

    const corretor: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) {
      throw new NotFoundException('User not found');
    }

    // Busca a correção com a relação redacao
    const correcao = await this.correcaoRepository.findOne({
      where: {
        correcaoId,
        corretor: { id: corretorId },
      },
      relations: ['redacao'], // Carrega a relação redacao
    });

    if (!correcao) {
      throw new NotFoundException('Correção não encontrada');
    }

    // Verifica se há outras correções para a redação
    const countCorrecoes = await this.correcaoRepository.count({
      where: { redacao: { id: correcao.redacao.id } },
    });

    // Atualiza o status da redação se for a última correção
    if (countCorrecoes === 1) {
      await this.redacaoRepository.update(correcao.redacao.id, {
        statusCorrecao: 'nao_corrigida',
      });
    }

    // Deleta a correção
    await this.correcaoRepository.delete(correcaoId);
  }
}
