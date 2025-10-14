import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { CorrecaoComments } from 'src/modules/correcoesModule/entities/correcaoComments.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteCorrecaoCommentService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoComments)
    private readonly correcaoCommentsRepository: Repository<CorrecaoComments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async deleteCorrecaoComment(
    corretorId: string,
    correcaoId: number,
    commentId: number,
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

    // Verifica se o usuário tem permissão para deletar o comentário da correção
    if (correcao.corretor.id !== corretorId) {
      throw new ForbiddenException(
        'You do not have permission to delete comments on this correction',
      );
    }

    // Verifica se o comentário existe
    const correcaoComment = await this.correcaoCommentsRepository.findOne({
      where: {
        correcao: { correcaoId: correcaoId },
        correcaoCommentId: commentId,
      },
    });

    if (!correcaoComment) throw new NotFoundException('Comment not found');

    // Deleta o comentário
    await this.correcaoCommentsRepository.delete(
      correcaoComment.correcaoCommentId,
    );

    return { message: 'Comment deleted successfully' };
  }
}
