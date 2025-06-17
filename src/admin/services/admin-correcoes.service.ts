import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { Repository } from 'typeorm';
import { AdminDeletionService } from './admin-deletion.service';

@Injectable()
export class AdminCorrecoesService {
  private readonly logger = new Logger(AdminCorrecoesService.name);

  constructor(
    @InjectRepository(Correcao)
    private correcoesRepository: Repository<Correcao>,
    private adminDeletionService: AdminDeletionService,
  ) {}

  async getCorrecaoById(
    id: number,
    adminUser: { id: string; name: string; email: string },
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) accessing correcao ${id}`,
    );

    const correcao = await this.correcoesRepository.findOne({
      where: { correcaoId: id },
      relations: [
        'corretor',
        'redacao',
        'redacao.user',
        'correcaoComments',
        'correcaoHighlights',
        'correcaoSuggestions',
        'correcaoFeedbacks',
        'correcaoFeedbacks.user',
      ],
    });

    if (!correcao) {
      throw new NotFoundException('Correção não encontrada');
    }

    // Calcular estatísticas
    const totalLikes =
      correcao.correcaoFeedbacks?.filter((f) => f.feedbackType === 'like')
        .length || 0;
    const totalDislikes =
      correcao.correcaoFeedbacks?.filter((f) => f.feedbackType === 'dislike')
        .length || 0;

    // Retornar dados completos para análise administrativa
    return {
      ...correcao,
      corretor: {
        id: correcao.corretor?.id,
        name: correcao.corretor?.name,
        email: correcao.corretor?.email,
      },
      redacao: {
        id: correcao.redacao.id,
        title: correcao.redacao.title,
        topic: correcao.redacao.topic,
        userId: correcao.redacao.user.id,
        name: correcao.redacao.user.name,
        email: correcao.redacao.user.email,
      },
      stats: {
        totalComments: correcao.correcaoComments?.length || 0,
        totalHighlights: correcao.correcaoHighlights?.length || 0,
        totalSuggestions: correcao.correcaoSuggestions?.length || 0,
        totalLikes,
        totalDislikes,
        totalFeedbacks: totalLikes + totalDislikes,
      },
    };
  }

  async deleteCorrecao(
    id: number,
    adminUser: { id: string; name: string; email: string },
  ) {
    return await this.adminDeletionService.deleteCorrecao(
      id,
      adminUser,
      'admin action',
    );
  }

  async getAllCorrecoes(
    pagination: any,
    adminUser: { id: string; name: string; email: string },
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) listing all correcoes`,
    );

    const {
      limit = 20,
      offset = 0,
      status,
      corretorId,
      redacaoId,
    } = pagination;

    const queryBuilder = this.correcoesRepository
      .createQueryBuilder('correcao')
      .leftJoinAndSelect('correcao.corretor', 'corretor')
      .leftJoinAndSelect('correcao.redacao', 'redacao')
      .leftJoinAndSelect('redacao.user', 'redacaoAuthor')
      .leftJoin('correcao.correcaoComments', 'comments')
      .leftJoin('correcao.correcaoFeedbacks', 'feedbacks')
      .addSelect([
        'COUNT(DISTINCT comments.correcaoCommentId) as totalComments',
        "COUNT(DISTINCT CASE WHEN feedbacks.feedbackType = 'like' THEN feedbacks.correcaoFeedbackId END) as totalLikes",
        "COUNT(DISTINCT CASE WHEN feedbacks.feedbackType = 'dislike' THEN feedbacks.correcaoFeedbackId END) as totalDislikes",
      ])
      .groupBy(
        'correcao.correcaoId, corretor.id, redacao.id, redacaoAuthor.id',
      );

    // Aplicar filtros
    if (status) {
      queryBuilder.andWhere('correcao.statusEnvio = :status', { status });
    }

    if (corretorId) {
      queryBuilder.andWhere('correcao.corretor.id = :corretorId', {
        corretorId,
      });
    }

    if (redacaoId) {
      queryBuilder.andWhere('correcao.redacao.id = :redacaoId', { redacaoId });
    }

    // Paginação e ordenação
    const [correcoes, total] = await queryBuilder
      .orderBy('correcao.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    // const redacoesWithoutUserDetails = redacoes.map((redacao) => ({
    //   id: redacao.id,
    //   title: redacao.title,
    //   topic: redacao.topic,
    //   content: redacao.content,
    //   statusEnvio: redacao.statusEnvio,
    //   createdAt: redacao.createdAt,
    //   updatedAt: redacao.updatedAt,
    //   userId: redacao.user.id,
    //   userName: redacao.user.name,
    //   userEmail: redacao.user.email,
    // }));

    const correcaoWithoutUserDetails = correcoes.map((correcao) => ({
      correcaoId: correcao.correcaoId,
      statusEnvio: correcao.statusEnvio,
      createdAt: correcao.createdAt,
      corretorId: correcao.corretor?.id,
      corretorName: correcao.corretor?.name,
      corretorEmail: correcao.corretor?.email,
      redacaoId: correcao.redacao.id,
      redacaoTitle: correcao.redacao.title,
      redacaoTopic: correcao.redacao.topic,
      userId: correcao.redacao.user.id,
      userName: correcao.redacao.user.name,
      userEmail: correcao.redacao.user.email,
    }));

    return {
      correcoes: correcaoWithoutUserDetails,
      total,
      limit,
      offset,
    };
  }
}
