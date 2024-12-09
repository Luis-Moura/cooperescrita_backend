import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DeleteUserByEmailDocs } from '../docs/controller/deleteUserByEmailDocs.decorator';
import { FindByEmailDocs } from '../docs/controller/findByEmailDocs.decorator';
import { FindByNameDocs } from '../docs/controller/findByNameDocs.decorator';
import { FindByEmailDto } from '../dto/find-by-email.dto';
import { FindByNameDto } from '../dto/find-by-name.dto';
import { AdminService } from '../services/admin.service';
@ApiTags('users')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('find-by-email')
  @FindByEmailDocs()
  async findByEmail(@Body() findByEmailDto: FindByEmailDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.adminService.findByEmail(findByEmailDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('find-by-name')
  @FindByNameDocs()
  async findByName(@Body() findByNameDto: FindByNameDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.adminService.findByName(findByNameDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete-user-by-email')
  @DeleteUserByEmailDocs()
  async deleteUserByEmail(
    @Body() findByEmailDto: FindByEmailDto,
    @Request() req,
  ) {
    const sender = req.user.email.toLowerCase();
    return await this.adminService.deleteUserByEmail(findByEmailDto, sender);
  }
}
