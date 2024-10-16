import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ISignIn } from './models/signIn.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: UserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const data: UserDto = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = this.usersRepository.create(data);
    await this.usersRepository.save(createdUser);

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async signIn(data: ISignIn) {
    const user = await this.usersService.findByEmailUtil(data.email);

    if (user) {
      const isPasswordMatch = await bcrypt.compare(
        data.password,
        user.password,
      );

      if (isPasswordMatch) {
        const payload = { sub: user.id, email: user.email, name: user.name };

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
}
