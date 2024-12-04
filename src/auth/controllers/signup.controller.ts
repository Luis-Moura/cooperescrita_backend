import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Roles } from '../decorators/roles.decorator';
import { SignUpAdminDocs } from '../docs/controller/signUpAdminDocs.decorator';
import { SignUpDocs } from '../docs/controller/signUpDocs.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth/signup')
export class SignupController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @HttpCode(200)
  @SignUpDocs()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto, 'user');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin')
  @HttpCode(200)
  @SignUpAdminDocs()
  signUpAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    const creatorRole = req.user.role;
    return this.authService.signUp(createUserDto, creatorRole);
  }
}
