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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RedacaoReportsService } from '../services/redacaoReports.service';
import { CreateRedacaoReportDto } from '../dto/createRedacaoReport.dto';
import { CreateRedacaoReportDocs } from '../docs/controllers/createRedacaoReportDocs.decorator';

@ApiTags('reports')
@Controller('report/redacao')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RedacaoReportsController {
  constructor(private readonly redacaoReportsService: RedacaoReportsService) {}

  @Post(':redacaoId')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Máximo 5 reports por minuto
  @CreateRedacaoReportDocs()
  async createReport(
    @Param('redacaoId', ParseIntPipe) redacaoId: number,
    @Body() createReportDto: CreateRedacaoReportDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.redacaoReportsService.createReport(
      userId,
      redacaoId,
      createReportDto,
    );
  }
}
