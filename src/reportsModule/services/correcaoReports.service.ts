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
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { CorrecaoReport } from '../entities/correcaoReport.entity';
import { CreateCorrecaoReportDto } from '../dto/createCorrecaoReport.dto';

@Injectable()
export class CorrecaoReportsService {
  constructor(
    @InjectRepository(CorrecaoReport)
    private correcaoReportsRepository: Repository<CorrecaoReport>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Correcao)
    private correcoesRepository: Repository<Correcao>,
  ) {}

  async createReport(
    userId: string,
    correcaoId: number,
    createReportDto: CreateCorrecaoReportDto,
  ) {
    try {
      // Buscar usuário
      const user = await this.usersRepository.findOne({
        where: { id: userId, active: true },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      // Buscar correção
      const correcao = await this.correcoesRepository.findOne({
        where: { correcaoId: correcaoId, statusEnvio: 'enviado' },
        relations: ['corretor', 'redacao'],
      });

      if (!correcao) {
        throw new NotFoundException(
          'Correção não encontrada ou não está pública',
        );
      }

      // Verificar se usuário não está reportando própria correção
      if (correcao.corretor.id === userId) {
        throw new ForbiddenException(
          'Você não pode reportar sua própria correção',
        );
      }

      // Verificar se usuário já reportou esta correção
      const existingReport = await this.correcaoReportsRepository.findOne({
        where: {
          reportedBy: { id: userId },
          correcao: { correcaoId: correcaoId },
        },
      });

      if (existingReport) {
        throw new ConflictException('Você já reportou esta correção');
      }

      // Criar report
      const report = this.correcaoReportsRepository.create({
        motivo: createReportDto.motivo,
        descricao: createReportDto.descricao,
        reportedBy: user,
        correcao: correcao,
      });

      const savedReport = await this.correcaoReportsRepository.save(report);

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
