import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindByEmailDto } from 'src/users/dto/find-by-email.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Verify2FACodeDto } from '../dto/verify2FACode.dto';
import { InvalidatedTokensService } from './invalidated-tokens.service';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
  ) {}
  async verifyEmail(token: string) {
    try {
      if (!token) {
        throw new BadRequestException('Invalid token');
      }

      const decoded: FindByEmailDto = this.jwtService.verify(token);

      if (!decoded.email) {
        throw new BadRequestException('Invalid token');
      }

      const user = await this.usersService.findByEmailUtil(
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
      return { message: 'Email verified successfully' };
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verify2FACode(verify2FACodeDto: Verify2FACodeDto) {
    const user = await this.usersService.findByEmailUtil(
      verify2FACodeDto.email.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException('Invalid Crenditials');
    }

    if (user.verificationCode !== verify2FACodeDto.verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    if (user.verificationCodeExpires < new Date()) {
      throw new BadRequestException('Verification code expired');
    }

    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await this.usersRepository.save(user);

    const payload = {
      jti: uuidv4(),
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string) {
    if (
      !token ||
      !this.jwtService.verify(token) ||
      (await this.invalidatedTokensService.isTokenInvalidated(token))
    ) {
      throw new BadRequestException('Invalid token');
    }

    return { message: 'Token is valid' };
  }
}
