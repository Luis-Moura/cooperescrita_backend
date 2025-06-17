import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  AdminDeleteRedacaoDocs,
  AdminListRedacoesDocs,
  AdminViewRedacaoDocs,
} from '../docs/controllers/adminRedacoesDocs.decorator';
import { AdminRedacoesPaginationDto } from '../dto/adminRedacoesPagination.dto';
import { AdminRedacoesService } from '../services/admin-redacoes.service';

@ApiTags('admin-redacoes')
@Controller('admin/redacoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminRedacoesController {
  constructor(private readonly adminRedacoesService: AdminRedacoesService) {}

  @Get(':id')
  @AdminViewRedacaoDocs()
  async getRedacaoById(@Param('id') id: number, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminRedacoesService.getRedacaoById(id, adminUser);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 300000 } })
  @AdminDeleteRedacaoDocs()
  async deleteRedacao(@Param('id') id: number, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminRedacoesService.deleteRedacao(id, adminUser);
  }

  @Get()
  @AdminListRedacoesDocs()
  async getAllRedacoes(
    @Query() pagination: AdminRedacoesPaginationDto,
    @Request() req,
  ) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminRedacoesService.getAllRedacoes(
      {
        limit: pagination.limit || 20,
        offset: pagination.offset || 0,
        status: pagination.status,
        userId: pagination.userId,
        search: pagination.search,
      },
      adminUser,
    );
  }
}
