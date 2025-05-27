import { Body, Controller, HttpCode, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDocs } from '../docs/controller/forgotPasswordDocs.decorator';
import { PostResetPasswordDocs } from '../docs/controller/postResetPasswordDocs.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { PasswordService } from '../services/password.service';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth/password')
export class PasswordController {
  constructor(private passwordService: PasswordService) {}

  @Post('forgot-password')
  @Throttle({ default: { limit: 10, ttl: 300000 } })
  @HttpCode(200)
  @ForgotPasswordDocs()
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Req() request: any,
  ) {
    const ipAddress = request.ip;
    return this.passwordService.forgotPassword(forgotPasswordDto, ipAddress);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 10, ttl: 300000 } }) // 10 tentativas a cada 5 minutos
  @HttpCode(200)
  @PostResetPasswordDocs()
  async postResetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.passwordService.postResetPassword({
      token,
      ...resetPasswordDto,
    });
  }
}
