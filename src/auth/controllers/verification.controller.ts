import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Verify2FACodeDocs } from '../docs/controller/verify2FACodeDocs.decorator';
import { VerifyAccessTokenDocs } from '../docs/controller/verifyAccessTokenDocs.decorator';
import { VerifyEmailDocs } from '../docs/controller/verifyEmailDocs.decorator';
import { VerifyResetPasswordTokenDocs } from '../docs/controller/verifyResetPasswordTokenDocs.decorator';
import { Verify2FACodeDto } from '../dto/verify2FACode.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { VerificationService } from '../services/verification.service';

@ApiTags('auth')
@Controller('auth/verify')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Get('email')
  @HttpCode(200)
  @VerifyEmailDocs()
  async verifyEmail(@Query('token') token: string) {
    return this.verificationService.verifyEmail(token);
  }

  @Post('2fa-code')
  @HttpCode(200)
  @Verify2FACodeDocs()
  async verify2FACode(
    @Body() verify2FACodeDto: Verify2FACodeDto,
    @Req() request: any,
  ) {
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'] || 'unknown';

    return this.verificationService.verify2FACode(
      verify2FACodeDto,
      ipAddress,
      userAgent,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('access-token')
  @VerifyAccessTokenDocs()
  async verifyAccessToken(@Request() req) {
    // Obtenção segura do token com verificação de nulos
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token inválido ou ausente');
    }

    const token = authHeader.split(' ')[1];
    return this.verificationService.verifyToken(token);
  }

  @Get('reset-password-token')
  @VerifyResetPasswordTokenDocs()
  async verifyResetPasswordToken(@Query('token') token: string) {
    return this.verificationService.verifyToken(token);
  }
}
