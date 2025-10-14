import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { EmailsModule } from 'src/modules/emails/emails.module';
import { TokenModule } from 'src/modules/token/token.module';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { PasswordController } from './controllers/password.controller';
import { SessionController } from './controllers/session.controller';
import { SigninController } from './controllers/signin.controller';
import { SignupController } from './controllers/signup.controller';
import { VerificationController } from './controllers/verification.controller';
import { RolesGuard } from './guards/roles.guard';
import { PasswordService } from './services/password.service';
import { SessionService } from './services/session.service';
import { SignInService } from './services/signin.service';
import { SignUpService } from './services/signup.service';
import { VerificationService } from './services/verification.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    EmailsModule,
    UsersModule,
    TokenModule,
  ],

  controllers: [
    SignupController,
    SigninController,
    VerificationController,
    PasswordController,
    SessionController,
  ],

  providers: [
    PasswordService,
    SessionService,
    SignInService,
    SignUpService,
    VerificationService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
  ],

  exports: [
    PasswordService,
    SessionService,
    SignInService,
    SignUpService,
    VerificationService,
  ],
})
export class AuthModule {}
