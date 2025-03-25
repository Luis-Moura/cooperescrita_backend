import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LogoutDocs } from '../docs/controller/logoutDocs.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SessionService } from '../services/session.service';

@ApiTags('auth')
@Controller('auth/session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  @LogoutDocs()
  async logout(@Request() req, @Body() body: { refreshToken?: string }) {
    const jwtToken = req.headers.authorization.split(' ')[1];
    const refreshToken = body.refreshToken;

    return this.sessionService.logout(jwtToken, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter detalhes do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Detalhes do usuário autenticado.' })
  async getMe(@Request() req) {
    return req.user;
  }
}
