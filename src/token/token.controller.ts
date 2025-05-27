import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { TokenService } from './token.service';
import { Public } from '../auth/decorators/isPublic.decorator';

@ApiTags('auth')
@Controller('auth/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 tentativas por minuto
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Novo par de tokens gerado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido, expirado ou revogado',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() request: Request,
  ) {
    try {
      // Extrair informações de contexto
      const ipAddress = request.ip;
      const userAgent = request.headers['user-agent'] || 'unknown';

      // Rotar tokens (gerar novos tokens)
      return await this.tokenService.rotateTokens(
        refreshTokenDto.refreshToken,
        ipAddress,
        userAgent,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
