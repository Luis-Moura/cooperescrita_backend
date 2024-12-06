import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDocs } from '../docs/controller/forgotPasswordDocs.decorator';
import { PostResetPasswordDocs } from '../docs/controller/postResetPasswordDocs.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { PasswordService } from '../services/password.service';

@ApiTags('auth')
@Controller('auth/password')
export class PasswordController {
  constructor(private passwordService: PasswordService) {}

  @Post('forgot-password')
  @HttpCode(200)
  @ForgotPasswordDocs()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.passwordService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
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
