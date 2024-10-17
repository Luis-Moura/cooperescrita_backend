import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IChangePassword } from './models/changePassword.interface';
import { IFindByEmail } from './models/findByEmail.interface';

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

  async findByEmail(data: IFindByEmail) {
    const user = await this.findByEmailUtil(data.email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    return { ...user, password: undefined };
  }

  async changePassword(data: IChangePassword) {
    const user = await this.findByEmailUtil(data.email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        data.oldPassword,
        user.password,
      );

      if (isPasswordMatching) {
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);

        return { message: 'Password changed successfully' };
      }

      throw new ConflictException('Invalid password');
    }

    throw new ConflictException('User not found');
  }
}
