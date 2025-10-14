import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CorrecaoReportsService } from '../services/correcaoReports.service';
import { CreateCorrecaoReportDto } from '../dto/createCorrecaoReport.dto';
import { CreateCorrecaoReportDocs } from '../docs/controllers/createCorrecaoReportDocs.decorator';

@ApiTags('reports')
@Controller('report/correcao')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CorrecaoReportsController {
  constructor(
    private readonly correcaoReportsService: CorrecaoReportsService,
  ) {}

  @Post(':correcaoId')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Máximo 5 reports por minuto
  @CreateCorrecaoReportDocs()
  async createReport(
    @Param('correcaoId', ParseIntPipe) correcaoId: number,
    @Body() createReportDto: CreateCorrecaoReportDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.correcaoReportsService.createReport(
      userId,
      correcaoId,
      createReportDto,
    );
  }
}
