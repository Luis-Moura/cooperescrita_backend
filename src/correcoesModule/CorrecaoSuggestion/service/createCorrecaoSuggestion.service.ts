import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { CorrecaoSuggestions } from 'src/correcoesModule/entities/correcaoSuggestions.entity';
import { User } from 'src/users/entities/user.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateCorrecaoSuggestionDto } from '../dto/createCorrecaosuggestion.dto';

@Injectable()
export class CreateCorrecaoSuggestionService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoSuggestions)
    private readonly correcaoSuggestionsRepository: Repository<CorrecaoSuggestions>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCorrecaoSuggestion(
    corretorId: string,
    createCorrecaoSuggestionDto: CreateCorrecaoSuggestionDto,
    correcaoId: number,
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

    // verifica se já existe algum sugestão no mesmo trecho e se o startIndex é menor que o endIndex
    if (
      createCorrecaoSuggestionDto.startIndex >
      createCorrecaoSuggestionDto.endIndex
    ) {
      throw new BadRequestException(
        'The startIndex must be less tahn or equal to endIndex',
      );
    }

    const existingHighlight = await this.correcaoSuggestionsRepository.findOne({
      where: {
        correcao: { correcaoId: correcaoId },
        startIndex: LessThanOrEqual(createCorrecaoSuggestionDto.endIndex),
        endIndex: MoreThanOrEqual(createCorrecaoSuggestionDto.startIndex),
      },
    });

    if (existingHighlight) {
      throw new BadRequestException(
        'There is already a suggestion with this range of startIndex and endIndex',
      );
    }

    // Verifica se o limite de sugestões por correção foi atingido (máximo: 100)
    const countSuggestions = await this.correcaoSuggestionsRepository.count({
      where: { correcao: { correcaoId: correcaoId } },
    });

    if (countSuggestions >= 100) {
      throw new BadRequestException(
        'The limit of suggestions per correction has been reached',
      );
    }

    const correcaoSuggestion = this.correcaoSuggestionsRepository.create({
      correcao,
      ...createCorrecaoSuggestionDto,
    });

    try {
      await this.correcaoSuggestionsRepository.save(correcaoSuggestion);
      return { ...correcaoSuggestion, correcao: correcaoId };
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Error creating suggestion:\n',
        error.message,
      );
    }
  }
}
