import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { EmailsModule } from 'src/emails/emails.module';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { PasswordController } from './controllers/password.controller';
import { SessionController } from './controllers/session.controller';
import { SigninController } from './controllers/signin.controller';
import { SignupController } from './controllers/signup.controller';
import { VerificationController } from './controllers/verification.controller';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    EmailsModule,
  ],
  controllers: [
    SignupController,
    SigninController,
    VerificationController,
    PasswordController,
    SessionController,
  ],
  providers: [
    AuthService,
    UsersService,
    // EmailsService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
