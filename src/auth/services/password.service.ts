import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { InvalidatedTokensService } from './invalidated-tokens.service';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailsService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
  ) {}
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmailUtil(
      forgotPasswordDto.email.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    await this.emailService.sendResetPasswordEmail(
      user.email.toLowerCase(),
      token,
    );

    return {
      message: 'Email sent with instructions to reset your password',
    };
  }

  async postResetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findByEmailUtil(
        decoded.email.toLowerCase(),
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (await this.invalidatedTokensService.isTokenInvalidated(token)) {
        throw new BadRequestException('Invalid or expired token');
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new ConflictException('Password cannot be the same');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.usersRepository.save(user);

      this.invalidatedTokensService.addToken(token);

      return { message: 'Password reset successfully' };
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('Invalid token or password');
    }
  }
}
