import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { CorrecaoComments } from 'src/correcoesModule/entities/correcaoComments.entity';
import { User } from 'src/users/entities/user.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateCorrecaoCommentsDto } from '../dto/createCorrecaoComments.dto';

@Injectable()
export class CreateCorrecaoCommentsService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoComments)
    private readonly correcaoCommentsRepository: Repository<CorrecaoComments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCorrecaoComments(
    corretorId: string,
    createCorrecaoCommentsDto: CreateCorrecaoCommentsDto,
    correcaoId: number,
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

    // Verifica se o usuário tem permissão para comentar na correção
    if (correcao.corretor.id !== corretorId) {
      throw new ForbiddenException(
        'You do not have permission to comment on this correction',
      );
    }

    //verifica se já existe algum comentário no mesmo trecho e se o startIndex é menor que o endIndex
    if (
      createCorrecaoCommentsDto.startIndex > createCorrecaoCommentsDto.endIndex
    ) {
      throw new BadRequestException(
        'The startIndex must be less than or equal to the endIndex',
      );
    }

    const existingComment = await this.correcaoCommentsRepository.findOne({
      where: {
        correcao: { correcaoId: correcaoId },
        startIndex: LessThanOrEqual(createCorrecaoCommentsDto.endIndex),
        endIndex: MoreThanOrEqual(createCorrecaoCommentsDto.startIndex),
      },
    });

    if (existingComment) {
      throw new BadRequestException(
        'There is already a comment with this range of startIndex and endIndex',
      );
    }

    // Verifica se o limite de comentários foi atingido (máximo: 3)
    const correcaoCommentsCount = await this.correcaoCommentsRepository.count({
      where: { correcao: { correcaoId: correcaoId } },
    });

    if (correcaoCommentsCount >= 5) {
      throw new BadRequestException('You can only comment up to 5 times');
    }

    // Cria o novo comentário
    const correcaoComment = this.correcaoCommentsRepository.create({
      comment: createCorrecaoCommentsDto.comment,
      startIndex: createCorrecaoCommentsDto.startIndex,
      endIndex: createCorrecaoCommentsDto.endIndex,
      correcao: correcao,
    });

    try {
      await this.correcaoCommentsRepository.save(correcaoComment);
      return {
        ...correcaoComment,
        correcao: correcaoId,
        corretorId: corretorId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create comment:\n',
        error.message,
      );
    }
  }
}
