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
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto, 'user');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('signup-admin')
  @HttpCode(200)
  signUpAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    const creatorRole = req.user.role;
    return this.authService.signUp(createUserDto, creatorRole);
  }

  //aqui
  @Get('verify-account')
  @HttpCode(200)
  async verifyAccount(@Query('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('verify-code')
  @HttpCode(200)
  async verifyAdminAccount(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  async verifyToken(@Request() req) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.authService.verifyToken(token);
  }

  @Get('verify-reset-token')
  async verifyResetToken(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  async postResetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.postResetPassword({ token, ...resetPasswordDto });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    return req.user;
  }
}
