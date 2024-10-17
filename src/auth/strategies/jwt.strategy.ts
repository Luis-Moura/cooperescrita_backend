import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmailUtil(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isTokenInvalidated = this.authService.isTokenInvalidated(payload.jti);
    // console.log(isTokenInvalidated);

    if (isTokenInvalidated) {
      throw new UnauthorizedException('Token invalidated');
    }

    if (!user.verified) {
      throw new UnauthorizedException('User not verified');
    }

    return { userId: payload.sub, name: payload.name, email: payload.email };
  }
}
