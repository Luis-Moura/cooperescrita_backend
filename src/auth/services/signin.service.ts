import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { UtilsService } from 'src/users/services/utils.service';
import { Repository } from 'typeorm';
import { SignInDto } from '../dto/sign-in.dto';
import { TokenService } from './token.service';

@Injectable()
export class SignInService {
  private readonly logger = new Logger(SignInService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly utilsService: UtilsService,
    private readonly emailService: EmailsService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(signInDto: SignInDto, ipAddress: string, userAgent: string) {
    const user = await this.validateUser(signInDto.email, signInDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.twoFA) {
      this.logger.log(`Enviando código 2FA para: ${user.email}`);
      return {
        message: 'Verification code sent to your email',
        requiresTwoFA: true,
      };
    }

    const accessToken = this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(
      user,
      ipAddress,
      userAgent,
    );

    return {
      access_token: accessToken.token,
      refresh_token: refreshToken.token,
      expires_in: accessToken.expiresIn,
    };
  }

  async validateUser(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const user = await this.utilsService.findByEmailUtil(normalizedEmail);

    if (!user) {
      this.logger.warn(
        `Tentativa de login com email não encontrado: ${normalizedEmail}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const lockTimeRemaining = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000,
      );
      this.logger.warn(
        `Tentativa de login em conta bloqueada: ${normalizedEmail}`,
      );
      throw new ForbiddenException(
        `Account is temporarily locked. Please try again in ${lockTimeRemaining} minutes.`,
      );
    }

    // Usar função de comparação de tempo constante para prevenir timing attacks
    const isPasswordMatch = await this.comparePassword(password, user.password);

    if (!isPasswordMatch) {
      user.failedLoginAttempts += 1;

      // Log graduais para diferentes níveis de tentativas
      if (user.failedLoginAttempts >= 3) {
        this.logger.warn(
          `Múltiplas tentativas de login (${user.failedLoginAttempts}) para usuário: ${normalizedEmail}`,
        );
      }

      if (user.failedLoginAttempts >= Number(process.env.MAX_FAILED_ATTEMPTS)) {
        const lockTimeMinutes = Number(process.env.LOCK_TIME) / 60000;
        user.lockUntil = new Date(Date.now() + Number(process.env.LOCK_TIME));
        user.failedLoginAttempts = 0;
        this.logger.warn(
          `Conta bloqueada por ${lockTimeMinutes} minutos: ${normalizedEmail}`,
        );
      }

      await this.usersRepository.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset contador de falhas após login bem-sucedido
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await this.usersRepository.save(user);
    }

    if (user.twoFA) {
      const verificationCode = this.generateSecureRandomCode();

      user.verificationCode = verificationCode;
      user.verificationCodeExpires = new Date(Date.now() + 600000); // 10 minutos
      await this.usersRepository.save(user);

      await this.emailService.sendVerificationCodeEmail(
        user.email,
        verificationCode,
      );
    }

    return {
      ...user,
      password: undefined,
    };
  }

  // Método para prevenir timing attacks
  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Método para gerar código 2FA mais seguro
  private generateSecureRandomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
