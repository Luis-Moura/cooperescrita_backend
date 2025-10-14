import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from 'src/modules/redacoesModule/entities/redacao.entity';
import { RedacaoComments } from 'src/modules/redacoesModule/entities/redacaoComments.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteRedacaoCommentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(RedacaoComments)
    private readonly redacaoCommentsRepository: Repository<RedacaoComments>,
  ) {}

  async deleteRedacaoComment(
    autorId: string,
    redacaoId: number,
    commentId: number,
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
    const comment = await this.redacaoCommentsRepository.findOne({
      where: { id: commentId },
      relations: ['autor'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (!comment.autor || comment.autor.id !== autorId) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Verifica se o autor do comentário é o mesmo que está tentando deletar
    if (comment.autor.id !== autor.id)
      throw new UnauthorizedException('Unauthorized');

    // Deleta o comentário
    await this.redacaoCommentsRepository.remove(comment);

    return { message: 'Comment deleted' };
  }
}
