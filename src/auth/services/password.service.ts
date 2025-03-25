import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { UtilsService } from 'src/users/services/utils.service';
import { Repository } from 'typeorm';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { InvalidatedTokensService } from './invalidated-tokens.service';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token.service';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);
  private resetAttempts = new Map<
    string,
    { count: number; lastAttempt: Date }
  >();

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailsService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
    private readonly tokenService: TokenService,
  ) {}

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    ipAddress: string,
  ) {
    const email = forgotPasswordDto.email.toLowerCase();

    // Verificar tentativas por IP
    this.checkResetAttempts(ipAddress);

    const user = await this.utilsService.findByEmailUtil(email);

    if (!user) {
      // Resposta genérica para prevenir enumeração de usuários
      this.logger.warn(
        `Tentativa de redefinição para email não existente: ${email}`,
      );
      return {
        message:
          'If your email is registered, you will receive reset instructions',
      };
    }

    // Adicionar jti para permitir invalidação
    const jti = uuidv4();
    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        jti: jti,
      },
      { expiresIn: '1h' },
    );

    await this.emailService.sendResetPasswordEmail(email, token);
    this.recordResetAttempt(ipAddress);

    this.logger.log(`Email de redefinição enviado para: ${email}`);
    return {
      message:
        'If your email is registered, you will receive reset instructions',
    };
  }

  async postResetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    try {
      // Verificar se o token já foi invalidado
      const decodedToken = this.jwtService.decode(token) as {
        jti: string;
        email: string;
      };
      if (!decodedToken || !decodedToken.jti) {
        throw new BadRequestException('Invalid token format');
      }

      if (
        await this.invalidatedTokensService.isTokenInvalidated(decodedToken.jti)
      ) {
        throw new BadRequestException('Token has already been used');
      }

      // Verificar token
      const decoded = this.jwtService.verify(token);
      const user = await this.utilsService.findByEmailUtil(
        decoded.email.toLowerCase(),
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Validar força da senha
      this.validatePasswordStrength(newPassword);

      // Verificar se é a mesma senha
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new ConflictException(
          'New password cannot be the same as the current password',
        );
      }

      // Atualizar senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await this.usersRepository.save(user);

      // Invalidar o token usado
      await this.invalidatedTokensService.addToken(decodedToken.jti);

      // Revogar todos os refresh tokens existentes
      await this.tokenService.revokeAllUserTokens(user.id);

      this.logger.log(`Senha redefinida com sucesso para: ${user.email}`);
      return { message: 'Password reset successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error(`Erro na redefinição de senha: ${error.message}`);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  private validatePasswordStrength(password: string) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      throw new BadRequestException(
        `Password must be at least ${minLength} characters long`,
      );
    }

    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
      throw new BadRequestException(
        'Password must include uppercase and lowercase letters, and numbers',
      );
    }

    if (!hasSpecialChars) {
      throw new BadRequestException(
        'Password must include at least one special character',
      );
    }
  }

  private checkResetAttempts(ipAddress: string) {
    const attempts = this.resetAttempts.get(ipAddress);
    if (!attempts) return;

    // Limpar tentativas após 1 hora
    const hourAgo = new Date(Date.now() - 3600000);
    if (attempts.lastAttempt < hourAgo) {
      this.resetAttempts.delete(ipAddress);
      return;
    }

    // Limitar a 5 tentativas por hora
    if (attempts.count >= 5) {
      this.logger.warn(
        `Muitas tentativas de redefinição de senha do IP: ${ipAddress}`,
      );
      throw new BadRequestException(
        'Too many password reset attempts. Please try again later.',
      );
    }
  }

  private recordResetAttempt(ipAddress: string) {
    const attempts = this.resetAttempts.get(ipAddress) || {
      count: 0,
      lastAttempt: new Date(),
    };
    attempts.count += 1;
    attempts.lastAttempt = new Date();
    this.resetAttempts.set(ipAddress, attempts);
  }
}
