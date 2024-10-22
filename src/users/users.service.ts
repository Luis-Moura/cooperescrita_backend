import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { User } from './entities/user.entity';
import { FindByNameDto } from './dto/find-by-name.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByEmailUtil(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(findByEmailDto: FindByEmailDto) {
    const user = await this.findByEmailUtil(findByEmailDto.email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    return { ...user, password: undefined };
  }

  async findByName(findByNameDto: FindByNameDto) {
    const user = await this.usersRepository.findOne({
      where: { name: findByNameDto.name },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return { ...user, password: undefined };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.findByEmailUtil(changePasswordDto.email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );

      if (isPasswordMatching) {
        const hashedPassword = await bcrypt.hash(
          changePasswordDto.newPassword,
          10,
        );
        user.password = hashedPassword;
        await this.usersRepository.save(user);

        return { message: 'Password changed successfully' };
      }

      throw new ConflictException('Invalid password');
    }

    throw new ConflictException('User not found');
  }
}
