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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 200, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Usuário já existe.' })
  @ApiResponse({
    status: 403,
    description: 'Apenas administradores podem criar contas de administrador.',
  })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto, 'user');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('signup-admin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Registrar um novo administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador registrado com sucesso.',
  })
  @ApiResponse({ status: 409, description: 'Usuário já existe.' })
  @ApiResponse({
    status: 403,
    description: 'Apenas administradores podem criar contas de administrador.',
  })
  signUpAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    const creatorRole = req.user.role;
    return this.authService.signUp(createUserDto, creatorRole);
  }

  //aqui
  @Get('verify-account')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar conta de usuário' })
  @ApiResponse({ status: 200, description: 'Email verificado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'Usuário já verificado.' })
  async verifyAccount(@Query('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Fazer login do usuário' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiResponse({ status: 403, description: 'Conta temporariamente bloqueada.' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('verify-code')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verificar código de autenticação de dois fatores' })
  @ApiResponse({ status: 200, description: 'Código verificado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Código de verificação inválido ou expirado.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async verifyAdminAccount(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar validade do token JWT' })
  @ApiResponse({ status: 200, description: 'Token é válido.' })
  @ApiResponse({ status: 400, description: 'Token inválido.' })
  async verifyToken(@Request() req) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.authService.verifyToken(token);
  }

  @Get('verify-reset-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar validade do token JWT' })
  @ApiResponse({ status: 200, description: 'Token é válido.' })
  @ApiResponse({ status: 400, description: 'Token inválido.' })
  async verifyResetToken(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout bem-sucedido.' })
  @ApiResponse({ status: 400, description: 'Token inválido.' })
  async logout(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  @ApiResponse({
    status: 200,
    description: 'Email enviado com instruções para redefinir a senha.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Redefinir senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token ou senha inválidos.' })
  @ApiResponse({
    status: 409,
    description: 'A nova senha não pode ser igual à anterior.',
  })
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
