import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authServices: AuthService,
  ) {}

  async logout(token: string) {
    if (!token || !this.jwtService.verify(token)) {
      throw new BadRequestException('Invalid token');
    }

    const decodedToken = this.jwtService.decode(token) as { jti: string };

    if (decodedToken && decodedToken.jti) {
      this.authServices.invalidatedTokens.add(decodedToken.jti); // isso aqui deve ser melhorado, e o quanto anteskkkk, usar o redis para salvar esses tokens por exemplo, ou uma tabela no banco de dados
    }

    return { message: 'Logout successful' };
  }
}
