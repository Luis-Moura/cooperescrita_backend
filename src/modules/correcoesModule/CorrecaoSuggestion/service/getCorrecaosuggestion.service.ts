import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { CorrecaoSuggestions } from 'src/modules/correcoesModule/entities/correcaoSuggestions.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetCorrecaoSuggestionService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoSuggestions)
    private readonly correcaoSuggestionsRepository: Repository<CorrecaoSuggestions>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCorrecaoSuggestion(corretorId: string, correcaoId: number) {
    // verificar a existencia do corretor
    if (!corretorId) throw new NotFoundException('User not found');

    const corretor: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) throw new NotFoundException('User not found');

    // Verifica se a correcao existe e carrega o corretor junto
    const correcao: Correcao = await this.correcaoRepository.findOne({
      where: { correcaoId: correcaoId },
      relations: ['corretor'],
    });

    if (!correcao) throw new NotFoundException('Correction not found');

    // Verifica se o corretor é o dono da correção ou se a correção foi enviada
    if (
      correcao.corretor.id !== corretor.id &&
      correcao.statusEnvio !== 'enviado'
    ) {
      throw new NotFoundException('Correction not found');
    }

    // busca as sugestões da correcao
    const correcaoSuggestions: CorrecaoSuggestions[] =
      await this.correcaoSuggestionsRepository.find({
        where: {
          correcao: { correcaoId: correcaoId },
        },
        order: { startIndex: 'ASC' },
      });

    return correcaoSuggestions;
  }

  async getCorrecaoSuggestionById(
    corretorId: string,
    correcaoId: number,
    suggestionId: number,
  ) {
    // verificar a existencia do corretor
    if (!corretorId) throw new NotFoundException('User not found');

    const corretor: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) throw new NotFoundException('User not found');

    // Verifica se a correcao existe e carrega o corretor junto
    const correcao: Correcao = await this.correcaoRepository.findOne({
      where: { correcaoId: correcaoId },
      relations: ['corretor'],
    });

    if (!correcao) throw new NotFoundException('Correction not found');

    // Verifica se o corretor é o dono da correção ou se a correção foi enviada
    if (
      correcao.corretor.id !== corretorId &&
      correcao.statusEnvio !== 'enviado'
    ) {
      throw new NotFoundException('Correction not found');
    }

    // busca a sugestão da correcao
    const correcaoSuggestion: CorrecaoSuggestions =
      await this.correcaoSuggestionsRepository.findOne({
        where: {
          correcao: { correcaoId: correcaoId },
          correctionSuggestionId: suggestionId,
        },
      });

    if (!correcaoSuggestion)
      throw new NotFoundException('Suggestion not found');

    return correcaoSuggestion;
  }
}
