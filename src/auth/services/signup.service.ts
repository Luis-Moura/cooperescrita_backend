import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly emailService: EmailsService,
    private readonly jwtService: JwtService,
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
}
