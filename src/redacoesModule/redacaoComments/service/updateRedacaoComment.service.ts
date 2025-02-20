import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { RedacaoComments } from 'src/redacoesModule/entities/redacaoComments.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRedacaoCommentDto } from '../dto/updateRedacaoComment.dto';

@Injectable()
export class UpdateRedacaoCommentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(RedacaoComments)
    private readonly redacaoCommentsRepository: Repository<RedacaoComments>,
  ) {}

  async updateRedacaoComment(
    autorId: string,
    redacaoId: number,
    commentId: number,
    updateRedacaoCommentdto: UpdateRedacaoCommentDto,
  ) {
    // verificar a existência do autor
    if (!autorId) throw new NotFoundException('User not found');

    const autor: User = await this.userRepository.findOne({
      where: { id: autorId },
    });

    if (!autor) throw new NotFoundException('User not found');

    // Verifica se a redação existe
    const redacao = await this.redacaoRepository.findOne({
      where: { id: redacaoId },
    });

    if (!redacao) throw new NotFoundException('Essay not found');

    // Verifica se o comentário existe
    const redacaoComment = await this.redacaoCommentsRepository.findOne({
      where: { id: commentId },
      relations: ['autor'],
    });

    if (!redacaoComment) throw new NotFoundException('Comment not found');

    if (!redacaoComment.autor || redacaoComment.autor.id !== autorId) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Atualiza o comentário
    redacaoComment.startIndex =
      updateRedacaoCommentdto.startIndex ?? redacaoComment.startIndex;

    redacaoComment.endIndex =
      updateRedacaoCommentdto.endIndex ?? redacaoComment.endIndex;

    redacaoComment.comentario =
      updateRedacaoCommentdto.comentario ?? redacaoComment.comentario;

    await this.redacaoCommentsRepository.save(redacaoComment);

    return { ...redacaoComment, autor: autorId, redacaoId };
  }
}
