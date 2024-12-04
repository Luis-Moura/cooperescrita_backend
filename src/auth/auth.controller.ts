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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { ForgotPasswordDocs } from './docs/controller/forgotPasswordDocs.decorator';
import { LogoutDocs } from './docs/controller/logoutDocs.decorator';
import { PostResetPasswordDocs } from './docs/controller/postResetPasswordDocs.decorator';
import { SignInDocs } from './docs/controller/signInDocs.decorator';
import { SignUpAdminDocs } from './docs/controller/signUpAdminDocs.decorator';
import { SignUpDocs } from './docs/controller/signUpDocs.decorator';
import { VerifyAccessTokenDocs } from './docs/controller/verifyAccessTokenDocs.decorator';
import { VerifyEmailDocs } from './docs/controller/verifyEmailDocs.decorator';
import { VerifyResetPasswordTokenDocs } from './docs/controller/verifyResetPasswordTokenDocs.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Verify2FACodeDto } from './dto/verify2FACode.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  @SignUpDocs()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto, 'user');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('signup-admin')
  @HttpCode(200)
  @SignUpAdminDocs()
  signUpAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    const creatorRole = req.user.role;
    return this.authService.signUp(createUserDto, creatorRole);
  }

  @Get('verify-email')
  @HttpCode(200)
  @VerifyEmailDocs()
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  @SignInDocs()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('verify-2fa-code')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar código de autenticação de dois fatores' })
  @ApiResponse({ status: 200, description: 'Código verificado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Código de verificação inválido ou expirado.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async verify2FACode(@Body() verify2FACodeDto: Verify2FACodeDto) {
    return this.authService.verify2FACode(verify2FACodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-access-token')
  @VerifyAccessTokenDocs()
  async verifyAccessToken(@Request() req) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.authService.verifyToken(token);
  }

  @Get('verify-reset-password-token')
  @VerifyResetPasswordTokenDocs()
  async verifyResetPasswordToken(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  @LogoutDocs()
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ForgotPasswordDocs()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  @PostResetPasswordDocs()
  async postResetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.postResetPassword({ token, ...resetPasswordDto });
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
