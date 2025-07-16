import { Controller, Get, Inject, Request, UseGuards } from '@nestjs/common';
import {
  DASHBOARD_USECASE,
  DashboardUseCase,
} from './useCase/DashboardUseCase';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { DashboardResponse } from './dto/DashboardResponse';
import { GetDashboardInfoDocs } from './docs/controllers/getDashboardInfoDocs.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(DASHBOARD_USECASE)
    private readonly dashboardUseCase: DashboardUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Get()
  @GetDashboardInfoDocs()
  async getDashboardInfo(@Request() req): Promise<DashboardResponse> {
    const userId = req.user.userId;
    return this.dashboardUseCase.getDashboardInfo(userId);
  }
}
