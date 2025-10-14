import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from 'src/modules/redacoesModule/entities/redacao.entity';
import { RedacaoComments } from 'src/modules/redacoesModule/entities/redacaoComments.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateRedacaoCommentsDto } from '../dto/createRedacaoComments.dto';

@Injectable()
export class CreateRedacaoCommentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(RedacaoComments)
    private readonly redacaoCommentsRepository: Repository<RedacaoComments>,
  ) {}

  async createRedacaoComments(
    autorId: string,
    createRedacaoCommentsDto: CreateRedacaoCommentsDto,
    redacaoId: number,
  ) {
    // verificar a existência do autor
    if (!autorId) throw new NotFoundException('User not found');

    const autor: User = await this.userRepository.findOne({
      where: { id: autorId },
    });

    if (!autor) throw new NotFoundException('User not found');

    // Verifica se a redação existe e carrega o autor junto
    const redacao = await this.redacaoRepository.findOne({
      where: { id: redacaoId, user: { id: autorId } },
      relations: ['user'], // Para garantir que `redacao.autor.id` existe
    });

    if (!redacao) throw new NotFoundException('Essay not found');

    // verifica se a redacao já foi enviada por definitivo
    if (redacao.statusEnvio !== 'enviado') {
      throw new ForbiddenException('You cannot comment on a draft essay');
    }

    // verifica se o usuario tem permissão para comentar na redação
    if (redacao.user.id !== autorId) {
      throw new ForbiddenException(
        'You do not have permission to comment on this essay',
      );
    }

    //verifica se já existe algum comentário no mesmo trecho e se o startIndex é menor que o endIndex
    if (
      createRedacaoCommentsDto.startIndex > createRedacaoCommentsDto.endIndex
    ) {
      throw new BadRequestException(
        'The startIndex must be less than or equal to the endIndex',
      );
    }

    const existingComment = await this.redacaoCommentsRepository.findOne({
      where: {
        redacao: { id: redacaoId },
        startIndex: LessThanOrEqual(createRedacaoCommentsDto.endIndex),
        endIndex: MoreThanOrEqual(createRedacaoCommentsDto.startIndex),
      },
    });

    if (existingComment) {
      throw new BadRequestException('There is already a comment on this range');
    }

    // verifica se o limite de comentários por redação foi atingido (máximo: 15)
    const totalComments = await this.redacaoCommentsRepository.count({
      where: { redacao: { id: redacaoId } },
    });

    if (totalComments >= 15) {
      throw new BadRequestException('Maximum number of comments reached');
    }

    // cria o novo comentário
    const redacaoComment = this.redacaoCommentsRepository.create({
      ...createRedacaoCommentsDto,
      autor,
      redacao,
    });

    try {
      await this.redacaoCommentsRepository.save(redacaoComment);
      return {
        ...redacaoComment,
        autor: autorId,
        redacao: redacaoId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating comment:\n',
        error.message,
      );
    }
  }
}
