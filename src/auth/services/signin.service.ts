import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class SignInService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailsService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmailUtil(
      signInDto.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.twoFA) {
      return {
        message: 'Verification code sent to your email',
      };
    }

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

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailUtil(email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new ForbiddenException('Account is temporarily locked');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= Number(process.env.MAX_FAILED_ATTEMPTS)) {
        user.lockUntil = new Date(Date.now() + Number(process.env.LOCK_TIME));
        user.failedLoginAttempts = 0;
      }

      await this.usersRepository.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await this.usersRepository.save(user);

    if (user.twoFA) {
      const verificationCode = crypto.randomBytes(3).toString('hex');
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = new Date(Date.now() + 600000);
      await this.usersRepository.save(user);

      await this.emailService.sendVerificationCodeEmail(
        user.email,
        verificationCode,
      );

      return {
        ...user,
        password: undefined,
      };
    }

    return {
      ...user,
      password: undefined,
    };
  }
}
