import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { RedacaoComments } from 'src/redacoesModule/entities/redacaoComments.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetRedacaoCommentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(RedacaoComments)
    private readonly redacaoCommentsRepository: Repository<RedacaoComments>,
  ) {}

  async getRedacaoComments(autorId: string, redacaoId: number) {
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

    // Busca os comentários da redação
    const redacaoComments: RedacaoComments[] =
      await this.redacaoCommentsRepository.find({
        where: {
          redacao: { id: redacaoId },
        },
        order: { startIndex: 'ASC' },
      });

    return redacaoComments;
  }

  async getRedacaoCommentById(
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

    // Busca o comentário da redação
    const redacaoComment: RedacaoComments =
      await this.redacaoCommentsRepository.findOne({
        where: {
          redacao: { id: redacaoId },
          id: commentId,
        },
      });

    if (!redacaoComment) throw new NotFoundException('Comment not found');

    return redacaoComment;
  }
}
