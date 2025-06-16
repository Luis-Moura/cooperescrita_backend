import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { RedacaoReport } from '../entities/redacaoReport.entity';
import { CreateRedacaoReportDto } from '../dto/createRedacaoReport.dto';

@Injectable()
export class RedacaoReportsService {
  constructor(
    @InjectRepository(RedacaoReport)
    private redacaoReportsRepository: Repository<RedacaoReport>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Redacao)
    private redacoesRepository: Repository<Redacao>,
  ) {}

  async createReport(
    userId: string,
    redacaoId: number,
    createReportDto: CreateRedacaoReportDto,
  ) {
    try {
      // Buscar usuário
      const user = await this.usersRepository.findOne({
        where: { id: userId, active: true },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Buscar redação
      const redacao = await this.redacoesRepository.findOne({
        where: { id: redacaoId, statusEnvio: 'enviado' },
        relations: ['user'],
      });

      if (!redacao) {
        throw new NotFoundException(
          'Redação não encontrada ou não está pública',
        );
      }

      // Verificar se usuário não está reportando própria redação
      if (redacao.user.id === userId) {
        throw new ForbiddenException(
          'Você não pode reportar sua própria redação',
        );
      }

      // Verificar se usuário já reportou esta redação
      const existingReport = await this.redacaoReportsRepository.findOne({
        where: {
          reportedBy: { id: userId },
          redacao: { id: redacaoId },
        },
      });

      if (existingReport) {
        throw new ConflictException('Você já reportou esta redação');
      }

      // Criar report
      const report = this.redacaoReportsRepository.create({
        motivo: createReportDto.motivo,
        descricao: createReportDto.descricao,
        reportedBy: user,
        redacao: redacao,
      });

      const savedReport = await this.redacaoReportsRepository.save(report);

      return {
        message: 'Report criado com sucesso',
        reportId: savedReport.id,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar report');
    }
  }
}
