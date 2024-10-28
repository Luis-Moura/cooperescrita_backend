/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { EmailsService } from 'src/emails/emails.service';
import { FindByEmailDto } from 'src/users/dto/find-by-email.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';
import { isTokenInvalidated } from './utils/isTokenInvalidated';
dotenv.config();

@Injectable()
export class AuthService {
  invalidatedTokens: Set<string> = new Set();

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailsService,
  ) {}

  async signUp(createUserDto: CreateUserDto, creatorRole: string) {
    const existingUser = await this.usersService.findByEmailUtil(
      createUserDto.email.toLowerCase(),
    );

    if (existingUser) {
      if (!existingUser.verified) {
        await this.usersRepository.remove(existingUser);
      } else {
        throw new ConflictException('User already exists');
      }
    }

    if (createUserDto.role === 'admin' && creatorRole !== 'admin') {
      throw new ForbiddenException('Only admins can create admin accounts');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      verified: false,
      twoFA: createUserDto.role === 'admin',
    });

    const token = this.jwtService.sign(
      { sub: newUser.id, email: newUser.email },
      { expiresIn: '15m' },
    );
    await this.usersRepository.save(newUser);

    await this.emailService.sendVerificationEmail(newUser.email, token);

    return {
      message:
        'User registered successfully. Please check your email for verification instructions.',
    };
  }

  async verifyAccount(token: string) {
    try {
      if (!token) {
        throw new BadRequestException('Invalid token');
      }

      const decoded: FindByEmailDto = this.jwtService.verify(token);
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
      throw new BadRequestException('Invalid or expired token');
    }
  }

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

  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    const user = await this.usersService.findByEmailUtil(
      verifyCodeDto.email.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException('Invalid Crenditials');
    }

    if (user.verificationCode !== verifyCodeDto.verificationCode) {
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

  async logout(token: string) {
    if (!token || !this.jwtService.verify(token)) {
      throw new BadRequestException('Invalid token');
    }

    const decodedToken = this.jwtService.decode(token) as { jti: string };

    if (decodedToken && decodedToken.jti) {
      this.invalidatedTokens.add(decodedToken.jti);
    }

    return { message: 'Logout successful' };
  }

  async verifyToken(token: string) {
    if (
      !token ||
      !this.jwtService.verify(token) ||
      isTokenInvalidated(token, this.invalidatedTokens)
    ) {
      throw new BadRequestException('Invalid token');
    }

    return { message: 'Token is valid' };
  }

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

  async getResetPasswordForm(token: string) {
    try {
      if (!token) {
        throw new BadRequestException('Invalid token');
      }

      if (
        isTokenInvalidated(token, this.invalidatedTokens) ||
        !this.jwtService.verify(token)
      ) {
        return { redirectUrl: '/password-created' };
      }

      return { view: 'reset-password', token };
    } catch (err) {
      throw new ConflictException('Invalid token');
    }
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

      if (isTokenInvalidated(token, this.invalidatedTokens)) {
        throw new BadRequestException('Invalid or expired token');
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new ConflictException('Password cannot be the same');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.usersRepository.save(user);

      this.invalidatedTokens.add(token);

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid token or password');
    }
  }
}
