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
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ActivateTwoFADocs } from './docs/controller/activateTwoFADocs.decorator';
import { ChangePasswordDocs } from './docs/controller/changePasswordDocs.decorator';
import { DeleteAccountDocs } from './docs/controller/deleteAccountDocs.decorator';
import { DeleteUserByEmailDocs } from './docs/controller/deleteUserByEmailDocs.decorator';
import { DesativateTwoFaDocs } from './docs/controller/desativateTwoFaDocs.decorator';
import { FindByEmailDocs } from './docs/controller/findByEmailDocs.decorator';
import { FindByNameDocs } from './docs/controller/findByNameDocs.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { FindByNameDto } from './dto/find-by-name.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-email')
  @FindByEmailDocs()
  async findByEmail(@Body() findByEmailDto: FindByEmailDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.findByEmail(findByEmailDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-name')
  @FindByNameDocs()
  async findByName(@Body() findByNameDto: FindByNameDto, @Request() req) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.findByName(findByNameDto, sender);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/admin/delete-user-by-email')
  @DeleteUserByEmailDocs()
  async deleteUserByEmail(
    @Body() findByEmailDto: FindByEmailDto,
    @Request() req,
  ) {
    const sender = req.user.email.toLowerCase();
    return await this.usersService.deleteUserByEmail(findByEmailDto, sender);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/change-password')
  @ChangePasswordDocs()
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
  @ActivateTwoFADocs()
  async activateTwoFA(@Request() req) {
    return this.usersService.activateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('desativate-twoFA')
  @HttpCode(200)
  @DesativateTwoFaDocs()
  async desativateTwoFa(@Request() req) {
    return this.usersService.desactivateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/users/delete-account')
  @DeleteAccountDocs()
  async deleteAccount(@Request() req) {
    const email = req.user.email.toLowerCase();

    return await this.usersService.deleteAccount(email);
  }
}
