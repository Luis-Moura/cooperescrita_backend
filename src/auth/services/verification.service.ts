import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindByEmailDto } from 'src/users/dto/find-by-email.dto';
import { User } from 'src/users/entities/user.entity';
import { UtilsService } from 'src/users/services/utils.service';
import { Repository } from 'typeorm';
import { Verify2FACodeDto } from '../dto/verify2FACode.dto';
import { InvalidatedTokensService } from '../../token/invalidated-tokens.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly verificationAttempts = new Map<string, number>();
  private readonly MAX_VERIFICATION_ATTEMPTS = 5;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly utilsService: UtilsService,
    private readonly jwtService: JwtService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
    private readonly tokenService: TokenService,
  ) {}

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    try {
      const decoded: FindByEmailDto = this.jwtService.verify(token);

      if (!decoded.email) {
        throw new BadRequestException('Invalid token');
      }

      const user = await this.utilsService.findByEmailUtil(
        decoded.email.toLowerCase(),
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.verified) {
        throw new ConflictException('User already verified');
      }

      user.verified = true;
      await this.usersRepository.save(user);

      this.logger.log(`Email verificado com sucesso: ${user.email}`);
      return { message: 'Email verified successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      this.logger.error(`Erro na verificação de email: ${error.message}`);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verify2FACode(
    verify2FACodeDto: Verify2FACodeDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const email = verify2FACodeDto.email.toLowerCase();

    // Verificar tentativas de verificação
    const attemptKey = `${email}:${ipAddress}`;
    const attempts = this.verificationAttempts.get(attemptKey) || 0;

    if (attempts >= this.MAX_VERIFICATION_ATTEMPTS) {
      this.logger.warn(
        `Muitas tentativas de verificação 2FA: ${email} (IP: ${ipAddress})`,
      );
      throw new UnauthorizedException(
        'Too many verification attempts. Please request a new code.',
      );
    }

    // Incrementar contador de tentativas
    this.verificationAttempts.set(attemptKey, attempts + 1);

    const user = await this.utilsService.findByEmailUtil(email);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    if (
      !user.verificationCode ||
      user.verificationCode !== verify2FACodeDto.verificationCode
    ) {
      this.logger.warn(`Código 2FA inválido para: ${email}`);
      throw new BadRequestException('Invalid verification code');
    }

    if (
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < new Date()
    ) {
      this.logger.warn(`Código 2FA expirado para: ${email}`);
      throw new BadRequestException('Verification code expired');
    }

    // Limpar código após uso bem-sucedido
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await this.usersRepository.save(user);

    // Limpar contador de tentativas
    this.verificationAttempts.delete(attemptKey);

    // Gerar tokens
    const accessToken = this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(
      user,
      ipAddress,
      userAgent,
    );

    this.logger.log(`Autenticação 2FA bem-sucedida: ${email}`);

    return {
      access_token: accessToken.token,
      refresh_token: refreshToken.token,
      expires_in: accessToken.expiresIn,
    };
  }

  async verifyToken(token: string) {
    try {
      if (!token) {
        throw new BadRequestException('Token is required');
      }

      const decodedToken = this.jwtService.verify(token);
      const isInvalidated =
        await this.invalidatedTokensService.isTokenInvalidated(
          decodedToken.jti || token,
        );

      if (isInvalidated) {
        this.logger.warn(
          `Tentativa de uso de token invalidado: ${decodedToken.sub}`,
        );
        throw new UnauthorizedException('Token has been invalidated');
      }

      return {
        valid: true,
        userId: decodedToken.sub,
        expiresAt: new Date(decodedToken.exp * 1000),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.warn(`Verificação de token falhou: ${error.message}`);
      return { valid: false };
    }
  }
}
