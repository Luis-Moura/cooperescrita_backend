import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from 'src/emails/emails.module';
import { AccountController } from './controllers/account.controller';
import { AdminController } from './controllers/admin.controller';
import { User } from './entities/user.entity';
import { AccountService } from './services/account.service';
import { AdminService } from './services/admin.service';
import { UtilsService } from './services/utils.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailsModule, TokenModule],
  providers: [AccountService, AdminService, UtilsService],
  controllers: [AccountController, AdminController],
  exports: [UtilsService],
})
export class UsersModule {}
