import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { Repository } from 'typeorm';
import { AdminDeletionService } from './admin-deletion.service';

@Injectable()
export class AdminRedacoesService {
  private readonly logger = new Logger(AdminRedacoesService.name);

  constructor(
    @InjectRepository(Redacao)
    private redacoesRepository: Repository<Redacao>,
    private adminDeletionService: AdminDeletionService,
  ) {}

  async getRedacaoById(
    id: number,
    adminUser: { id: string; name: string; email: string },
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) accessing redacao ${id}`,
    );

    const redacao = await this.redacoesRepository.findOne({
      where: { id },
      relations: [
        'user',
        'correcoes',
        'correcoes.corretor',
        'comentariosRedacao',
        'comentariosRedacao.autor',
      ],
    });

    if (!redacao) {
      throw new NotFoundException('Redação não encontrada');
    }

    // Retornar dados completos para análise administrativa
    return {
      ...redacao,
      correcoes: {
        total: redacao.correcoes?.length || 0,
        details: redacao.correcoes?.map((correcao) => ({
          id: correcao.correcaoId,
          corretor: {
            id: correcao.corretor.id,
            name: correcao.corretor.name,
            email: correcao.corretor.email,
          },
        })),
      },
      user: {
        id: redacao.user.id,
        name: redacao.user.name,
        email: redacao.user.email,
      },
      stats: {
        totalCorrecoes: redacao.correcoes?.length || 0,
        totalComentarios: redacao.comentariosRedacao?.length || 0,
      },
    };
  }

  async deleteRedacao(
    id: number,
    adminUser: { id: string; name: string; email: string },
  ) {
    return await this.adminDeletionService.deleteRedacao(
      id,
      adminUser,
      'admin action',
    );
  }

  async getAllRedacoes(
    pagination: any,
    adminUser: { id: string; name: string; email: string },
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) listing all redacoes`,
    );

    const { limit = 20, offset = 0, status, userId, search } = pagination;

    const queryBuilder = this.redacoesRepository
      .createQueryBuilder('redacao')
      .leftJoinAndSelect('redacao.user', 'user')
      .leftJoin('redacao.correcoes', 'correcoes')
      .leftJoin('redacao.comentariosRedacao', 'comentarios')
      .addSelect([
        'COUNT(DISTINCT correcoes.correcaoId) as totalCorrecoes',
        'COUNT(DISTINCT comentarios.id) as totalComentarios',
      ])
      .groupBy('redacao.id, user.id');

    // Aplicar filtros
    if (status) {
      queryBuilder.andWhere('redacao.statusEnvio = :status', { status });
    }

    if (userId) {
      queryBuilder.andWhere('redacao.user.id = :userId', { userId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(redacao.title) LIKE LOWER(:search) OR LOWER(redacao.topic) LIKE LOWER(:search) OR LOWER(redacao.content) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Paginação e ordenação
    const [redacoes, total] = await queryBuilder
      .orderBy('redacao.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const redacoesWithoutUserDetails = redacoes.map((redacao) => ({
      id: redacao.id,
      title: redacao.title,
      topic: redacao.topic,
      statusEnvio: redacao.statusEnvio,
      createdAt: redacao.createdAt,
      updatedAt: redacao.updatedAt,
      userId: redacao.user.id,
      userName: redacao.user.name,
      userEmail: redacao.user.email,
    }));

    return {
      redacoes: redacoesWithoutUserDetails,
      total,
      limit,
      offset,
    };
  }
}
