import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { Verify2FACodeDocs } from '../docs/controller/verify2FACodeDocs.decorator';
import { VerifyAccessTokenDocs } from '../docs/controller/verifyAccessTokenDocs.decorator';
import { VerifyEmailDocs } from '../docs/controller/verifyEmailDocs.decorator';
import { VerifyResetPasswordTokenDocs } from '../docs/controller/verifyResetPasswordTokenDocs.decorator';
import { Verify2FACodeDto } from '../dto/verify2FACode.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth/verify')
export class VerificationController {
  constructor(private authService: AuthService) {}

  @Get('email')
  @HttpCode(200)
  @VerifyEmailDocs()
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('2fa-code')
  @HttpCode(200)
  @Verify2FACodeDocs()
  async verify2FACode(@Body() verify2FACodeDto: Verify2FACodeDto) {
    return this.authService.verify2FACode(verify2FACodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('access-token')
  @VerifyAccessTokenDocs()
  async verifyAccessToken(@Request() req) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.authService.verifyToken(token);
  }

  @Get('reset-password-token')
  @VerifyResetPasswordTokenDocs()
  async verifyResetPasswordToken(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }
}
