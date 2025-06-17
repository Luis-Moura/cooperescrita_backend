import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminFiltersDto } from '../dto/adminFilters.dto';
import { ResolveReportDto } from '../dto/resolveReport.dto';
import { AdminReportsService } from '../services/admin-reports.service';
import {
  AdminReportsDocs,
  AdminResolveReportDocs,
  AdminReportsStatsDocs,
} from '../docs/controllers/adminReportsDocs.decorator';

@ApiTags('admin-reports')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get('redacoes')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @AdminReportsDocs()
  async getRedacaoReports(@Query() filters: AdminFiltersDto, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminReportsService.getRedacaoReports(
      filters.limit || 20,
      filters.offset || 0,
      filters,
      adminUser,
    );
  }

  @Get('correcoes')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @AdminReportsDocs()
  async getCorrecaoReports(@Query() filters: AdminFiltersDto, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminReportsService.getCorrecaoReports(
      filters.limit || 20,
      filters.offset || 0,
      filters,
      adminUser,
    );
  }

  @Patch('redacao/:reportId/resolve')
  @AdminResolveReportDocs()
  async resolveRedacaoReport(
    @Param('reportId') reportId: string,
    @Body() resolveDto: ResolveReportDto,
    @Request() req,
  ) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminReportsService.resolveRedacaoReport(
      reportId,
      resolveDto,
      adminUser,
    );
  }

  @Patch('correcao/:reportId/resolve')
  @AdminResolveReportDocs()
  async resolveCorrecaoReport(
    @Param('reportId') reportId: string,
    @Body() resolveDto: ResolveReportDto,
    @Request() req,
  ) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminReportsService.resolveCorrecaoReport(
      reportId,
      resolveDto,
      adminUser,
    );
  }

  @Get('stats')
  @AdminReportsStatsDocs()
  async getReportsStats(@Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminReportsService.getReportsStats(adminUser);
  }
}
