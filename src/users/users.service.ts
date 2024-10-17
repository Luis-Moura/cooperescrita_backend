import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
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
}
