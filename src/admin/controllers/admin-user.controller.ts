import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DeleteUserByEmailDocs } from '../docs/controllers/deleteUserByEmailDocs.decorator';
import { FindByEmailDocs } from '../docs/controllers/findByEmailDocs.decorator';
import { FindByNameDocs } from '../docs/controllers/findByNameDocs.decorator';
import { ListUsersDocs } from '../docs/controllers/listUsersDocs.decorator';
import { ToggleUserStatusDocs } from '../docs/controllers/toggleUserStatusDocs.decorator';
import { FindByEmailDto } from 'src/users/dto/find-by-email.dto';
import { FindByNameDto } from 'src/users/dto/find-by-name.dto';
import { PaginationDto } from 'src/users/dto/pagination.dto';
import { AdminUserService } from '../services/admin-user.service';

@ApiTags('admin')
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('find-by-email')
  @FindByEmailDocs()
  async findByEmail(@Body() findByEmailDto: FindByEmailDto, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminUserService.findByEmail(findByEmailDto, adminUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('find-by-name')
  @FindByNameDocs()
  async findByName(@Body() findByNameDto: FindByNameDto, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminUserService.findByName(findByNameDto, adminUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('list')
  @ListUsersDocs()
  async listUsers(@Query() paginationDto: PaginationDto, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminUserService.listUsers(paginationDto, adminUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete-by-email')
  @Throttle({ default: { limit: 15, ttl: 600000 } }) // 15 tentativas a cada 10 minutos
  @DeleteUserByEmailDocs()
  async deleteUserByEmail(
    @Body() findByEmailDto: FindByEmailDto,
    @Request() req,
  ) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminUserService.deleteUserByEmail(
      findByEmailDto,
      adminUser,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':userId/toggle-status')
  @HttpCode(200)
  @ToggleUserStatusDocs()
  async toggleUserStatus(@Param('userId') userId: string, @Request() req) {
    const adminUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
    return await this.adminUserService.toggleUserStatus(userId, adminUser);
  }
}
