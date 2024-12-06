import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidatedTokensService } from './invalidated-tokens.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly invalidatedTokensService: InvalidatedTokensService,
  ) {}

  async logout(token: string) {
    if (!token || !this.jwtService.verify(token)) {
      throw new BadRequestException('Invalid token');
    }

    const decodedToken = this.jwtService.decode(token) as { jti: string };

    if (decodedToken && decodedToken.jti) {
      await this.invalidatedTokensService.addToken(decodedToken.jti);
    }

    return { message: 'Logout successful' };
  }
}
