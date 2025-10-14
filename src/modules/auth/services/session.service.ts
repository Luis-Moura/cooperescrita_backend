import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidatedTokensService } from '../../token/invalidated-tokens.service';
import { TokenService } from 'src/modules/token/token.service';
import { UtilsService } from 'src/modules/users/services/utils.service';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
    private readonly utilsService: UtilsService,
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

  async getProfile(email: string) {
    const user = await this.utilsService.findByEmailUtil(email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      twoFA: user.twoFA,
    };
  }
}
