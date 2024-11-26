import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { UsersService } from './users.service';
import { FindByNameDto } from './dto/find-by-name.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por email' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async findByEmail(@Body() findByEmailDto: FindByEmailDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.findByEmail(findByEmailDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-name')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por email' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async findByName(@Body() findByNameDto: FindByNameDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.findByName(findByNameDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/admin/delete-user-by-email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar usuário por email' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async deleteUserByEmail(
    @Body() findByEmailDto: FindByEmailDto,
    @Request() req,
  ) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.deleteUserByEmail(findByEmailDto, sender);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar senha usando a a senha atual' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 400, description: 'Senha incorreta.' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    const email = req.user.email.toLowerCase();

    return await this.usersService.changePassword(changePasswordDto, email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate-twoFA')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ativar autenticação de dois fatores' })
  @ApiResponse({
    status: 200,
    description: 'Autenticação de dois fatores ativada.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Autenticação de dois fatores já ativada.',
  })
  async activateTwoFA(@Request() req) {
    return this.usersService.activateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('desativate-twoFA')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desativar autenticação de dois fatores' })
  @ApiResponse({
    status: 200,
    description: 'Autenticação de dois fatores desativada.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Autenticação de dois fatores já desativada.',
  })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async desativateTwoFa(@Request() req) {
    return this.usersService.desactivateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/users/delete-account')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar conta do usuário' })
  @ApiResponse({ status: 200, description: 'Conta deletada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async deleteAccount(@Request() req) {
    const email = req.user.email.toLowerCase();

    return await this.usersService.deleteAccount(email);
  }
}
