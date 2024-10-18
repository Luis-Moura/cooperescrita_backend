/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';
import { UserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/entities/user.entity';
import { IFindByEmail } from 'src/users/models/findByEmail.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ISignIn } from './models/signIn.interface';

@Injectable()
export class AuthService {
  invalidatedTokens: Set<string> = new Set();

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailsService,
  ) {}

  async signUp(createUserDto: UserDto) {
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

  async verifyEmail(token: string) {
    const decoded: IFindByEmail = this.jwtService.verify(token);
    const user = await this.usersService.findByEmailUtil(decoded.email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    user.verified = true;
    await this.usersRepository.save(user);
  }

  async signIn(data: ISignIn) {
    const user = await this.usersService.findByEmailUtil(data.email);

    if (!user.verified) {
      throw new ConflictException('User not verified');
    }

    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        data.password,
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

  isTokenInvalidated(token: string): boolean {
    return this.invalidatedTokens.has(token);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmailUtil(email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });

    await this.emailService.sendResetPasswordEmail(user.email, token);

    return {
      message: 'Email sent with instructions to reset your password',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findByEmailUtil(decoded.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (this.isTokenInvalidated(token)) {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ConflictException('Invalid token or password');
    }
  }

  async validateResetToken(token: string) {
    try {
      if (this.isTokenInvalidated(token)) {
        // Alteração: Melhoria na nomenclatura das variáveis
        return { tokenIsValid: false, tokenIsExpired: false };
      }

      const tokenIsValid = this.jwtService.verify(token);

      return { tokenIsValid, tokenIsExpired: false };
    } catch (error) {
      return { tokenIsValid: false, tokenIsExpired: true };
    }
  }
}
