import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  @Cron('* * * * *')
  async handleCron() {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() - 1);

    const users = await this.usersRepository.find({
      where: { verified: false, createdAt: LessThan(expirationTime) },
    });

    if (users.length > 0) {
      console.log('Users to delete:', users);
      await this.usersRepository.remove(users);
    }
  }
}
