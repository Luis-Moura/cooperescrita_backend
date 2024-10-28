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

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-email')
  async findByEmail(@Body() findByEmailDto: FindByEmailDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.findByEmail(findByEmailDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-name')
  async findByName(@Body() findByNameDto: FindByNameDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.findByName(findByNameDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/admin/delete-user-by-email')
  async deleteUserByEmail(
    @Body() findByEmailDto: FindByEmailDto,
    @Request() req,
  ) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.deleteUserByEmail(findByEmailDto, sender);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    const email = req.user.email.toLowerCase();

    return await this.usersService.changePassword({
      email,
      ...changePasswordDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate-twoFA')
  @HttpCode(200)
  async activateTwoFA(@Request() req) {
    return this.usersService.activateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('desativate-twoFA')
  @HttpCode(200)
  async desativateTwoFa(@Request() req) {
    return this.usersService.desactivateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/users/delete-account')
  async deleteAccount(@Request() req) {
    const email = req.user.email.toLowerCase();

    return await this.usersService.deleteAccount(email);
  }
}
