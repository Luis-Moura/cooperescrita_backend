// src/token/token.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RefreshToken } from './entities/refreshToken.entity';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { InvalidatedTokensService } from './invalidated-tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '30m' },
      }),
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, InvalidatedTokensService],
  exports: [TokenService, InvalidatedTokensService, JwtModule],
})
export class TokenModule {}
