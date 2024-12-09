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
import { UsersService } from '../users.service';

@ApiTags('users')
@Controller('users/account')
export class AccountController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
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
  @Delete('/delete-account')
  @DeleteAccountDocs()
  async deleteAccount(@Request() req) {
    const email = req.user.email.toLowerCase();

    return await this.usersService.deleteAccount(email);
  }
}
