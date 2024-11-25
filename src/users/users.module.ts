import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from 'src/emails/emails.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailsModule],
  controllers: [UsersController],
  providers: [UsersService], //EmailsService
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
