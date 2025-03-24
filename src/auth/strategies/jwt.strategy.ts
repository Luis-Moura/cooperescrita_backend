import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UtilsService } from 'src/users/services/utils.service';
import { InvalidatedTokensService } from '../services/invalidated-tokens.service';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly utilsService: UtilsService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Validação completa do payload
    if (!payload.jti || !payload.sub || !payload.email) {
      this.logAuthEvent(
        'failure',
        payload.sub || 'unknown',
        'Invalid token structure',
      );
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.utilsService.findByEmailUtil(
      payload.email.toLowerCase(),
    );

    if (!user) {
      this.logAuthEvent('failure', payload.sub, 'User not found');
      throw new UnauthorizedException('User not found');
    }

    // Verificar se o token foi invalidado
    const tokenInvalidated =
      await this.invalidatedTokensService.isTokenInvalidated(payload.jti);

    if (tokenInvalidated) {
      this.logAuthEvent(
        'failure',
        payload.sub,
        'Attempted use of invalidated token',
      );
      throw new UnauthorizedException('Token invalidated');
    }

    if (!user.verified) {
      this.logAuthEvent(
        'failure',
        payload.sub,
        'Unverified user attempted access',
      );
      throw new UnauthorizedException('User not verified');
    }

    // Verificação de ambiente de execução (IP/dispositivo) - Base para maior segurança
    // const requestInfo = this.getRequestInfo();
    // if (requestInfo && payload.iss && requestInfo !== payload.iss) {
    //   this.logAuthEvent('failure', payload.sub, 'Token usado em ambiente diferente do emitido');
    //   throw new UnauthorizedException('Token environment mismatch');
    // }

    this.logAuthEvent('success', payload.sub, `Autenticado com sucesso`);

    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
      role: user.role,
    };
  }

  private logAuthEvent(
    type: 'success' | 'failure',
    userId: string,
    details: string,
  ): void {
    if (type === 'failure') {
      this.logger.warn(`Auth failure: ${details} - User: ${userId}`);
    } else {
      this.logger.log(`Auth success: ${details} - User: ${userId}`);
    }
    // Futuramente, pode salvar em banco ou enviar para sistema de monitoramento
  }
}
