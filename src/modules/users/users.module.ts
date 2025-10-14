import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from 'src/modules/emails/emails.module';
import { AccountController } from './controllers/account.controller';
import { User } from './entities/user.entity';
import { AccountService } from './services/account.service';
import { UtilsService } from './services/utils.service';
import { TokenModule } from 'src/modules/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailsModule, TokenModule],
  providers: [AccountService, UtilsService],
  controllers: [AccountController],
  exports: [UtilsService],
})
export class UsersModule {}
