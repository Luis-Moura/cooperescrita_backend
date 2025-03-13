import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { CorrecaoHighlights } from 'src/correcoesModule/entities/correcaoHighlights.entity';
import { User } from 'src/users/entities/user.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateCorrecaoHighlightsDto } from '../dto/createCorrecaoHighlights.dto';

@Injectable()
export class CreateCorrecaoHighlightsService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoHighlights)
    private readonly correcaoHighlightsRepository: Repository<CorrecaoHighlights>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createCorrecaoHighlights(
    corretorId: string,
    createCorrecaoHighlightsDto: CreateCorrecaoHighlightsDto,
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

    // verifica se o usuário tem permissão para comentar na correção
    if (correcao.corretor.id !== corretorId)
      throw new ForbiddenException(
        'You do not have permission to comment on this correction',
      );

    // verifica se a correção já foi enviada por definitivo
    if (correcao.statusEnvio === 'enviado') {
      throw new BadRequestException(
        'You cannot comment on a correction that has already been sent',
      );
    }

    // verifica se já existe algum comentário no mesmo trecho e se o startIndex é menor que o endIndex
    if (
      createCorrecaoHighlightsDto.startIndex >
      createCorrecaoHighlightsDto.endIndex
    ) {
      throw new BadRequestException(
        'The startIndex must be less tahn or equal to endIndex',
      );
    }

    const existingHighlight = await this.correcaoHighlightsRepository.findOne({
      where: {
        correcao: { correcaoId: correcaoId },
        startIndex: LessThanOrEqual(createCorrecaoHighlightsDto.endIndex),
        endIndex: MoreThanOrEqual(createCorrecaoHighlightsDto.startIndex),
      },
    });

    if (existingHighlight) {
      throw new BadRequestException(
        'There is already a comment with this range of startIndex and endIndex',
      );
    }

    // Verifica se o limite de marcações foi atingido (máximo: 15)
    const correcaoHighlightsCount =
      await this.correcaoHighlightsRepository.count({
        where: { correcao: { correcaoId: correcaoId } },
      });

    if (correcaoHighlightsCount >= 15) {
      throw new BadRequestException(
        'You can only add highlights up to 15 times',
      );
    }

    // cria um nobo highlight
    const correcaoHighlight: CorrecaoHighlights =
      this.correcaoHighlightsRepository.create({
        startIndex: createCorrecaoHighlightsDto.startIndex,
        endIndex: createCorrecaoHighlightsDto.endIndex,
        color: createCorrecaoHighlightsDto.color,
        correcao: correcao,
      });

    try {
      await this.correcaoHighlightsRepository.save(correcaoHighlight);
      return { ...correcaoHighlight, correcao: correcaoId };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Failed to create comment:\n',
        error.message,
      );
    }
  }
}
