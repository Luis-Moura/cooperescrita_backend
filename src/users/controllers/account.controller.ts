import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ActivateTwoFADocs } from '../docs/controller/activateTwoFADocs.decorator';
import { ChangePasswordDocs } from '../docs/controller/changePasswordDocs.decorator';
import { DeleteAccountDocs } from '../docs/controller/deleteAccountDocs.decorator';
import { DesativateTwoFaDocs } from '../docs/controller/desativateTwoFaDocs.decorator';
import { UpdateProfileDocs } from '../docs/controller/updateProfileDocs.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { AccountService } from '../services/account.service';
import { Throttle } from '@nestjs/throttler';

@ApiTags('users')
@Controller('users/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UpdateProfileDocs()
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req,
  ) {
    const email = req.user.email.toLowerCase();
    return await this.accountService.updateProfile(updateProfileDto, email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @Throttle({ default: { limit: 15, ttl: 300000 } }) // 15 tentativas a cada 5 minutos
  @ChangePasswordDocs()
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    const email = req.user.email.toLowerCase();
    return await this.accountService.changePassword(changePasswordDto, email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate-twoFA')
  @HttpCode(200)
  @ActivateTwoFADocs()
  async activateTwoFA(@Request() req) {
    return this.accountService.activateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('desativate-twoFA')
  @HttpCode(200)
  @DesativateTwoFaDocs()
  async desativateTwoFa(@Request() req) {
    return this.accountService.desactivateTwoFA(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-account')
  @Throttle({ default: { limit: 10, ttl: 300000 } }) // Limitar tentativas de exclusão
  @DeleteAccountDocs()
  async deleteAccount(@Request() req) {
    const email = req.user.email.toLowerCase();
    return await this.accountService.deleteAccount(email);
  }
}
