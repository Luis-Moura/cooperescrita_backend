import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { EmailsModule } from 'src/emails/emails.module';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
// import { AuthService } from './auth.service';
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
import { InvalidatedTokensService } from './services/invalidated-tokens.service';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),

    PassportModule,
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
    InvalidatedTokensService,
    PasswordService,
    SessionService,
    SignInService,
    SignUpService,
    VerificationService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [
    InvalidatedTokensService,
    PasswordService,
    SessionService,
    SignInService,
    SignUpService,
    VerificationService,
  ],
})
export class AuthModule {}
