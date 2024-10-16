import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { UserDto } from 'src/users/dto/users.dto';
import { AuthService } from './auth.service';
import { ISignIn } from './models/signIn.interface';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: UserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @HttpCode(200)
  signIn(@Body() data: ISignIn) {
    return this.authService.signIn(data);
  }

  @Get('me')
  async getMe(@Request() req: any) {
    const user = await req.user;

    return {
      email: user.email,
      name: user.name,
    };
  }
}
