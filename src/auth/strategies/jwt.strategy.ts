import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { InvalidatedTokensService } from '../services/invalidated-tokens.service';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    // private readonly authService: AuthService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmailUtil(
      payload.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const TokenInvalidated =
      await this.invalidatedTokensService.isTokenInvalidated(payload.jti);

    if (TokenInvalidated) {
      throw new UnauthorizedException('Token invalidated');
    }

    if (!user.verified) {
      throw new UnauthorizedException('User not verified');
    }

    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
      role: user.role,
    };
  }
}
