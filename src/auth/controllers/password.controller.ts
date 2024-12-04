import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ForgotPasswordDocs } from '../docs/controller/forgotPasswordDocs.decorator';
import { PostResetPasswordDocs } from '../docs/controller/postResetPasswordDocs.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth/password')
export class PasswordController {
  constructor(private authService: AuthService) {}

  @Post('forgot-password')
  @HttpCode(200)
  @ForgotPasswordDocs()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  @PostResetPasswordDocs()
  async postResetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.postResetPassword({ token, ...resetPasswordDto });
  }
}
