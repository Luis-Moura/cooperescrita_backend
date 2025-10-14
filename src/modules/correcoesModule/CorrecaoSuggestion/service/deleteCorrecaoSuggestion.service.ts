import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { CorrecaoSuggestions } from 'src/modules/correcoesModule/entities/correcaoSuggestions.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteCorrecaoSuggestionsService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoSuggestions)
    private readonly correcaoSuggestionsRepository: Repository<CorrecaoSuggestions>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async deleteCorrecaoSuggestions(
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
      where: { correcaoId: correcaoId, corretor: { id: corretorId } },
      relations: ['corretor'],
    });

    if (!correcao) throw new NotFoundException('Correction not found');

    // verifica se o usuário tem permissão para adicionar uma sugestão na correção
    if (correcao.corretor.id !== corretorId)
      throw new ForbiddenException(
        'You do not have permission to suggest on this correction',
      );

    // busca a sugestão da correcao para deletar
    const correcaoSuggestion: CorrecaoSuggestions =
      await this.correcaoSuggestionsRepository.findOne({
        where: {
          correcao: { correcaoId: correcaoId },
          correctionSuggestionId: suggestionId,
        },
      });

    if (!correcaoSuggestion)
      throw new NotFoundException('Suggestion not found');

    // deleta a sugestão
    await this.correcaoSuggestionsRepository.remove(correcaoSuggestion);
    return { message: 'Suggestion deleted successfully' };
  }
}
