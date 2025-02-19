import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { CorrecaoHighlights } from 'src/correcoesModule/entities/correcaoHighlights.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetCorrecaoHighlightsService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoHighlights)
    private readonly correcaoHighlightsRepository: Repository<CorrecaoHighlights>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCorrecaoHighlights(corretorId: string, correcaoId: number) {
    // verificar a existência do corretor
    if (!corretorId) throw new NotFoundException('User not found');

    const corretor: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) throw new NotFoundException('User not found');

    // Verifica se a correção existe e carrega o corretor junto
    const correcao = await this.correcaoRepository.findOne({
      where: { correcaoId: correcaoId, corretor: { id: corretorId } },
      relations: ['corretor'], // Para garantir que `correcao.corretor.id` existe
    });

    if (!correcao) throw new NotFoundException('Correction not found');

    // Busca os highlights da correcao
    const correcaoHighlights: CorrecaoHighlights[] =
      await this.correcaoHighlightsRepository.find({
        where: {
          correcao: { correcaoId: correcaoId },
        },
        order: { startIndex: 'ASC' },
      });

    return correcaoHighlights;
  }

  async getCorrecaoHighlightById(
    corretorId: string,
    correcaoId: number,
    highlightId: number,
  ) {
    // verificar a existência do corretor
    if (!corretorId) throw new NotFoundException('User not found');

    const corretor: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) throw new NotFoundException('User not found');

    // Verifica se a correção existe e carrega o corretor junto
    const correcao = await this.correcaoRepository.findOne({
      where: { correcaoId: correcaoId, corretor: { id: corretorId } },
      relations: ['corretor'], // Para garantir que `correcao.corretor.id` existe
    });

    if (!correcao) throw new NotFoundException('Correction not found');

    // Busca o highlight da correcao
    const highlightComment: CorrecaoHighlights =
      await this.correcaoHighlightsRepository.findOne({
        where: {
          correcao: { correcaoId: correcaoId },
          correcaoHighlightId: highlightId,
        },
      });

    if (!highlightComment) throw new NotFoundException('Highlight not found');

    return highlightComment;
  }
}
