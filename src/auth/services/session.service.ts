import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidatedTokensService } from './invalidated-tokens.service';
import { TokenService } from './token.service';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
  ) {}

  async logout(jwtToken: string, refreshToken?: string) {
    if (!jwtToken) {
      throw new BadRequestException('Invalid token');
    }

    try {
      // Invalidar JWT
      const decodedToken = this.jwtService.decode(jwtToken) as {
        jti: string;
        sub: string;
      };

      if (decodedToken && decodedToken.jti) {
        await this.invalidatedTokensService.addToken(decodedToken.jti);
      }

      // Revogar refresh token se fornecido
      if (refreshToken) {
        await this.tokenService.revokeToken(refreshToken);
      }

      return { message: 'Logout successful' };
    } catch (error) {
      this.logger.error(`Erro ao realizar logout: ${error.message}`);
      throw new BadRequestException('Error during logout');
    }
  }
}
