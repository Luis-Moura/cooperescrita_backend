import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../entities/refreshToken.entity';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  createAccessToken(user: User) {
    const jti = uuidv4();
    const payload = {
      jti,
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Usar a configuração do ambiente
    const expiresIn = process.env.JWT_EXPIRES_IN || '30m';

    // Converter para segundos para retornar ao cliente
    const expiresInSeconds = expiresIn.includes('d')
      ? parseInt(expiresIn) * 24 * 60 * 60 // dias para segundos
      : expiresIn.includes('h')
        ? parseInt(expiresIn) * 60 * 60 // horas para segundos
        : parseInt(expiresIn) * 60; // minutos para segundos

    return {
      token: this.jwtService.sign(payload, { expiresIn }),
      expiresIn: expiresInSeconds,
    };
  }

  async createRefreshToken(user: User, ipAddress: string, userAgent: string) {
    const token = uuidv4();
    const expiration = new Date();

    const refreshTokenDays = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || '7',
    );
    expiration.setDate(expiration.getDate() + refreshTokenDays);

    // Limitar número de refresh tokens por usuário
    const existingTokens = await this.refreshTokenRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });

    // Manter apenas os 5 mais recentes
    if (existingTokens.length >= 5) {
      const tokensToRemove = existingTokens.slice(4);
      await this.refreshTokenRepository.remove(tokensToRemove);
    }

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId: user.id,
      expiresAt: expiration,
      ipAddress,
      userAgent,
    });

    await this.refreshTokenRepository.save(refreshToken);
    this.logger.log(`Refresh token criado para usuário: ${user.id}`);

    return {
      token,
      expiresIn: Math.floor((expiration.getTime() - Date.now()) / 1000),
    };
  }

  async rotateTokens(
    refreshTokenString: string,
    ipAddress: string,
    userAgent: string,
  ) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenString },
      relations: ['user'],
    });

    if (
      !refreshToken ||
      refreshToken.expiresAt < new Date() ||
      refreshToken.revoked
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verificar se o contexto mudou drasticamente
    if (refreshToken.ipAddress !== ipAddress) {
      this.logger.warn(
        `Possível roubo de token: IP diferente para token ${refreshToken.token}`,
      );

      // Revogar todos os tokens do usuário
      await this.revokeAllUserTokens(refreshToken.userId);
      throw new UnauthorizedException(
        'Session invalidated due to security concerns',
      );
    }

    // Criar novos tokens
    const access = this.createAccessToken(refreshToken.user);
    const refresh = await this.createRefreshToken(
      refreshToken.user,
      ipAddress,
      userAgent,
    );

    // Revogar token antigo
    refreshToken.revoked = true;
    refreshToken.replacedByToken = refresh.token;
    await this.refreshTokenRepository.save(refreshToken);

    return {
      accessToken: access.token,
      refreshToken: refresh.token,
      expiresIn: access.expiresIn,
    };
  }

  async revokeToken(token: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (!refreshToken) {
      throw new NotFoundException('Token not found');
    }

    refreshToken.revoked = true;
    await this.refreshTokenRepository.save(refreshToken);
    this.logger.log(`Refresh token revogado: ${token}`);
  }

  async revokeAllUserTokens(userId: string) {
    const tokens = await this.refreshTokenRepository.find({
      where: { userId, revoked: false },
    });

    for (const token of tokens) {
      token.revoked = true;
      await this.refreshTokenRepository.save(token);
    }

    this.logger.warn(`Todos os tokens revogados para usuário: ${userId}`);
  }
}
