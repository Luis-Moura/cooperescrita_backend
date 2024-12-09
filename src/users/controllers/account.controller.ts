import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ActivateTwoFADocs } from '../docs/controller/activateTwoFADocs.decorator';
import { ChangePasswordDocs } from '../docs/controller/changePasswordDocs.decorator';
import { DeleteAccountDocs } from '../docs/controller/deleteAccountDocs.decorator';
import { DesativateTwoFaDocs } from '../docs/controller/desativateTwoFaDocs.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AccountService } from '../services/account.service';

@ApiTags('users')
@Controller('users/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
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
  @DeleteAccountDocs()
  async deleteAccount(@Request() req) {
    const email = req.user.email.toLowerCase();

    return await this.accountService.deleteAccount(email);
  }
}
