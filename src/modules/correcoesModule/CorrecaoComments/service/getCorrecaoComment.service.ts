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
export class GetCorrecaoCommentsService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoComments)
    private readonly correcaoCommentsRepository: Repository<CorrecaoComments>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCorrecaoComments(corretorId: string, correcaoId: number) {
    // verificar a existência do corretor
    if (!corretorId) throw new NotFoundException('User not found');

    const corretor: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) throw new NotFoundException('User not found');

    // Verifica se a correção existe e carrega o corretor junto
    const correcao = await this.correcaoRepository.findOne({
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

    // Busca os comentários da correção
    const correcaoComments: CorrecaoComments[] =
      await this.correcaoCommentsRepository.find({
        where: {
          correcao: { correcaoId: correcaoId },
        },
        order: { startIndex: 'ASC' },
      });

    return correcaoComments;
  }

  async getCorrecaoCommentById(
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

    // Verifica se o usuário tem permissão para ver os comentários da correção
    if (correcao.corretor.id !== corretorId) {
      throw new ForbiddenException(
        'You do not have permission to view comments on this correction',
      );
    }

    // Busca o comentário da correção
    const correcaoComment: CorrecaoComments =
      await this.correcaoCommentsRepository.findOne({
        where: {
          correcao: { correcaoId: correcaoId },
          correcaoCommentId: commentId,
        },
      });

    if (!correcaoComment) throw new NotFoundException('Comment not found');

    return correcaoComment;
  }
}
