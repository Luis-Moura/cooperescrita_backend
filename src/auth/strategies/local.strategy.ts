import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SignInService } from '../services/signin.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private signInService: SignInService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    try {
      const normalizedEmail = email.toLowerCase();
      this.logger.debug(`Tentativa de autenticação para: ${normalizedEmail}`);

      const user = await this.signInService.validateUser(
        normalizedEmail,
        password,
      );

      if (!user) {
        this.logger.warn(`Falha na autenticação para: ${normalizedEmail}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.verified) {
        this.logger.warn(
          `Tentativa de login com conta não verificada: ${normalizedEmail}`,
        );
        throw new UnauthorizedException('User not verified');
      }

      this.logger.log(`Autenticação bem-sucedida para: ${normalizedEmail}`);
      return user;
    } catch (error) {
      // Preservar mensagens específicas de erro do serviço
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(`Erro durante autenticação: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
