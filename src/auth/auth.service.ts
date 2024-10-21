/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
// import { IFindByEmail } from 'src/users/models/findByEmail.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { isTokenInvalidated } from './utils/isTokenInvalidated';
import { FindByEmailDto } from 'src/users/dto/find-by-email.dto';

@Injectable()
export class AuthService {
  invalidatedTokens: Set<string> = new Set();

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailsService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      verified: false,
    });

    const token = this.jwtService.sign(
      { sub: newUser.id },
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
    if (!token) {
      throw new ConflictException('Invalid token');
    }

    const decoded: FindByEmailDto = this.jwtService.verify(token);
    const user = await this.usersService.findByEmailUtil(decoded.email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    user.verified = true;
    await this.usersRepository.save(user);
    return { message: 'Email verified successfully' };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmailUtil(signInDto.email);

    if (!user.verified) {
      throw new ConflictException('User not verified');
    }

    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        signInDto.password,
        user.password,
      );

      if (isPasswordMatch) {
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
    }

    throw new ConflictException('Invalid credentials');
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailUtil(email);

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    return null;
  }

  async logout(token: string) {
    const decodedToken = this.jwtService.decode(token) as { jti: string };

    if (decodedToken && decodedToken.jti) {
      this.invalidatedTokens.add(decodedToken.jti);
    }

    return { message: 'Logout successful' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmailUtil(
      forgotPasswordDto.email,
    );

    if (!user) {
      throw new ConflictException('User not found');
    }

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });

    await this.emailService.sendResetPasswordEmail(user.email, token);

    return {
      message: 'Email sent with instructions to reset your password',
    };
  }

  async getResetPasswordForm(token: string) {
    try {
      if (!token) {
        throw new ConflictException('Invalid token');
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
      const user = await this.usersService.findByEmailUtil(decoded.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (isTokenInvalidated(token, this.invalidatedTokens)) {
        throw new ConflictException('Invalid or expired token');
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
      throw new ConflictException('Invalid token or password');
    }
  }
}
