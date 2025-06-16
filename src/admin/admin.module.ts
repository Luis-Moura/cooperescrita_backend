import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailsModule } from 'src/emails/emails.module';
import { TokenModule } from 'src/token/token.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminUserService } from './services/admin-user.service';
import { AdminAuthService } from './services/admin-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    EmailsModule,
    TokenModule,
    UsersModule,
  ],
  controllers: [AdminUserController, AdminAuthController],
  providers: [AdminUserService, AdminAuthService],
  exports: [AdminUserService, AdminAuthService],
})
export class AdminModule {}
