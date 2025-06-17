import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { AdminDeletionService } from './admin-deletion.service';
import { RedacaoReport } from 'src/reportsModule/entities/redacaoReport.entity';
import { CorrecaoReport } from 'src/reportsModule/entities/correcaoReport.entity';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { AdminFiltersDto } from '../dto/adminFilters.dto';
import { ResolveReportDto } from '../dto/resolveReport.dto';

@Injectable()
export class AdminReportsService {
  private readonly logger = new Logger(AdminReportsService.name);

  constructor(
    @InjectRepository(RedacaoReport)
    private redacaoReportsRepository: Repository<RedacaoReport>,
    @InjectRepository(CorrecaoReport)
    private correcaoReportsRepository: Repository<CorrecaoReport>,
    @InjectRepository(Redacao)
    private redacoesRepository: Repository<Redacao>,
    @InjectRepository(Correcao)
    private correcoesRepository: Repository<Correcao>,
    private emailsService: EmailsService,
    private adminDeletionService: AdminDeletionService,
  ) {}

  async getRedacaoReports(
    limit: number,
    offset: number,
    filters: AdminFiltersDto,
    adminUser: { id: string; name: string; email: string },
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) accessing redacao reports`,
    );

    const queryBuilder = this.redacaoReportsRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reportedBy', 'reporter')
      .leftJoinAndSelect('report.redacao', 'redacao')
      .leftJoinAndSelect('redacao.user', 'redacaoAuthor')
      .select([
        'report.id',
        'report.motivo',
        'report.descricao',
        'report.status',
        'report.createdAt',
        'report.updatedAt',
        'reporter.id',
        'reporter.name',
        'reporter.email',
        'redacao.id',
        'redacao.title',
        'redacao.topic',
        'redacao.statusEnvio',
        'redacao.createdAt',
        'redacaoAuthor.id',
        'redacaoAuthor.name',
        'redacaoAuthor.email',
      ]);

    // Aplicar filtros
    if (filters.status) {
      queryBuilder.andWhere('report.status = :status', {
        status: filters.status,
      });
    }

    if (filters.motivo) {
      queryBuilder.andWhere('report.motivo = :motivo', {
        motivo: filters.motivo,
      });
    }

    if (filters.dataInicial && filters.dataFinal) {
      queryBuilder.andWhere(
        'report.createdAt BETWEEN :dataInicial AND :dataFinal',
        {
          dataInicial: new Date(filters.dataInicial),
          dataFinal: new Date(filters.dataFinal),
        },
      );
    }

    // Paginação e ordenação
    const [reports, total] = await queryBuilder
      .orderBy('report.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      reports,
      total,
      limit,
      offset,
    };
  }

  async getCorrecaoReports(
    limit: number,
    offset: number,
    filters: AdminFiltersDto,
    adminUser: { id: string; name: string; email: string },
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) accessing correcao reports`,
    );

    const queryBuilder = this.correcaoReportsRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.reportedBy', 'reporter')
      .leftJoinAndSelect('report.correcao', 'correcao')
      .leftJoinAndSelect('correcao.corretor', 'corretor')
      .leftJoinAndSelect('correcao.redacao', 'redacao')
      .select([
        'report.id',
        'report.motivo',
        'report.descricao',
        'report.status',
        'report.createdAt',
        'report.updatedAt',
        'reporter.id',
        'reporter.name',
        'reporter.email',
        'correcao.correcaoId',
        'correcao.statusEnvio',
        'correcao.createdAt',
        'corretor.id',
        'corretor.name',
        'corretor.email',
        'redacao.id',
        'redacao.title',
        'redacao.topic',
      ]);

    // Aplicar filtros
    if (filters.status) {
      queryBuilder.andWhere('report.status = :status', {
        status: filters.status,
      });
    }

    if (filters.motivo) {
      queryBuilder.andWhere('report.motivo = :motivo', {
        motivo: filters.motivo,
      });
    }

    if (filters.dataInicial && filters.dataFinal) {
      queryBuilder.andWhere(
        'report.createdAt BETWEEN :dataInicial AND :dataFinal',
        {
          dataInicial: new Date(filters.dataInicial),
          dataFinal: new Date(filters.dataFinal),
        },
      );
    }

    // Paginação e ordenação
    const [reports, total] = await queryBuilder
      .orderBy('report.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      reports,
      total,
      limit,
      offset,
    };
  }

  async resolveRedacaoReport(
    reportId: string,
    resolveDto: ResolveReportDto,
    adminUser: { id: string; name: string; email: string },
  ) {
    const report = await this.redacaoReportsRepository.findOne({
      where: { id: reportId },
      relations: ['redacao', 'redacao.user', 'reportedBy'],
    });

    if (!report) {
      throw new NotFoundException('Report não encontrado');
    }

    if (report.status !== 'pendente') {
      throw new BadRequestException('Report já foi resolvido');
    }

    // Atualizar status do report
    report.status = resolveDto.acao;
    await this.redacaoReportsRepository.save(report);

    // Se deve deletar o conteúdo
    if (resolveDto.deletarConteudo) {
      await this.adminDeletionService.deleteRedacao(
        report.redacao.id,
        adminUser,
        'report resolution',
      );
    }

    // Registrar log da ação
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) resolved redacao report ${reportId} with action: ${resolveDto.acao}`,
    );

    // Enviar email de notificação para o dono do report
    await this.emailsService.sendReportResolvedNotification(
      report.reportedBy.email,
      'redacao',
      reportId,
      resolveDto.acao,
      resolveDto.deletarConteudo || false,
      resolveDto.observacoes,
    );

    return {
      message: 'Report resolvido com sucesso',
      reportId,
      acao: resolveDto.acao,
      conteudoDeletado: resolveDto.deletarConteudo || false,
    };
  }

  async resolveCorrecaoReport(
    reportId: string,
    resolveDto: ResolveReportDto,
    adminUser: { id: string; name: string; email: string },
  ) {
    const report = await this.correcaoReportsRepository.findOne({
      where: { id: reportId },
      relations: [
        'correcao',
        'correcao.corretor',
        'correcao.redacao',
        'reportedBy',
      ],
    });

    if (!report) {
      throw new NotFoundException('Report não encontrado');
    }

    if (report.status !== 'pendente') {
      throw new BadRequestException('Report já foi resolvido');
    }

    // Atualizar status do report
    report.status = resolveDto.acao;
    await this.correcaoReportsRepository.save(report);

    // Se deve deletar o conteúdo
    if (resolveDto.deletarConteudo) {
      await this.adminDeletionService.deleteCorrecao(
        report.correcao.correcaoId,
        adminUser,
        'report resolution',
      );
    }

    // Registrar log da ação
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) resolved correcao report ${reportId} with action: ${resolveDto.acao}`,
    );

    // Enviar email de notificação para o admin se necessário
    if (resolveDto.deletarConteudo) {
      await this.emailsService.sendReportAlertAdmin(
        `Conteúdo deletado por admin ${adminUser.name}: Correção #${report.correcao.correcaoId} foi removida após análise de report`,
      );
    }

    // Enviar email de notificação para o dono do report
    await this.emailsService.sendReportResolvedNotification(
      report.reportedBy.email,
      'correcao',
      reportId,
      resolveDto.acao,
      resolveDto.deletarConteudo || false,
      resolveDto.observacoes,
    );

    return {
      message: 'Report resolvido com sucesso',
      reportId,
      acao: resolveDto.acao,
      conteudoDeletado: resolveDto.deletarConteudo || false,
    };
  }

  async getReportsStats(adminUser: {
    id: string;
    name: string;
    email: string;
  }) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) accessing reports statistics`,
    );

    // Estatísticas de reports de redação
    const redacaoStats = await this.redacaoReportsRepository
      .createQueryBuilder('report')
      .select('report.status, COUNT(*) as count')
      .groupBy('report.status')
      .getRawMany();

    const redacaoMotivos = await this.redacaoReportsRepository
      .createQueryBuilder('report')
      .select('report.motivo, COUNT(*) as count')
      .groupBy('report.motivo')
      .getRawMany();

    // Estatísticas de reports de correção
    const correcaoStats = await this.correcaoReportsRepository
      .createQueryBuilder('report')
      .select('report.status, COUNT(*) as count')
      .groupBy('report.status')
      .getRawMany();

    const correcaoMotivos = await this.correcaoReportsRepository
      .createQueryBuilder('report')
      .select('report.motivo, COUNT(*) as count')
      .groupBy('report.motivo')
      .getRawMany();

    // Tendência temporal (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const redacaoTrend = await this.redacaoReportsRepository
      .createQueryBuilder('report')
      .select('DATE(report.createdAt) as date, COUNT(*) as count')
      .where('report.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('DATE(report.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    const correcaoTrend = await this.correcaoReportsRepository
      .createQueryBuilder('report')
      .select('DATE(report.createdAt) as date, COUNT(*) as count')
      .where('report.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('DATE(report.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      redacaoReports: {
        statusDistribution: redacaoStats,
        motivoDistribution: redacaoMotivos,
        trend: redacaoTrend,
      },
      correcaoReports: {
        statusDistribution: correcaoStats,
        motivoDistribution: correcaoMotivos,
        trend: correcaoTrend,
      },
      summary: {
        totalRedacaoReports: redacaoStats.reduce(
          (acc, curr) => acc + parseInt(curr.count),
          0,
        ),
        totalCorrecaoReports: correcaoStats.reduce(
          (acc, curr) => acc + parseInt(curr.count),
          0,
        ),
        pendingReports:
          Number(
            redacaoStats.find((s) => s.status === 'pendente')?.count || 0,
          ) +
          Number(
            correcaoStats.find((s) => s.status === 'pendente')?.count || 0,
          ),
      },
    };
  }
}
