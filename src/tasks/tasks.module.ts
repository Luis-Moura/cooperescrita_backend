import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  providers: [TasksService],
})
export class TasksModule {}
