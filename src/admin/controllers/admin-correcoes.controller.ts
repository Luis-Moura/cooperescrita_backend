import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminCorrecoesService } from '../services/admin-correcoes.service';
import { AdminCorrecoesPaginationDto } from '../dto/adminCorrecoesPagination.dto';
import {
  AdminViewCorrecaoDocs,
  AdminDeleteCorrecaoDocs,
  AdminListCorrecoesDocs,
} from '../docs/controllers/adminCorrecoesDocs.decorator';

@ApiTags('admin-correcoes')
@Controller('admin/correcoes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCorrecoesController {
  constructor(private readonly adminCorrecoesService: AdminCorrecoesService) {}

  @Get(':id')
  @AdminViewCorrecaoDocs()
  async getCorrecaoById(@Param('id') id: number, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminCorrecoesService.getCorrecaoById(id, adminUser);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 300000 } })
  @AdminDeleteCorrecaoDocs()
  async deleteCorrecao(@Param('id') id: number, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminCorrecoesService.deleteCorrecao(id, adminUser);
  }

  @Get()
  @AdminListCorrecoesDocs()
  async getAllCorrecoes(
    @Query() pagination: AdminCorrecoesPaginationDto,
    @Request() req,
  ) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminCorrecoesService.getAllCorrecoes(
      {
        limit: pagination.limit || 20,
        offset: pagination.offset || 0,
        status: pagination.status,
        corretorId: pagination.corretorId,
        redacaoId: pagination.redacaoId,
      },
      adminUser,
    );
  }
}
