import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/users/dto/users.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ISignIn } from './models/signIn.interface';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: UserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  signIn(@Body() data: ISignIn) {
    return this.authService.signIn(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return req.user;
  }
}
