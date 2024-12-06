import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { SignUpAdminDocs } from '../docs/controller/signUpAdminDocs.decorator';
import { SignUpDocs } from '../docs/controller/signUpDocs.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SignUpService } from '../services/signup.service';

@ApiTags('auth')
@Controller('auth/signup')
export class SignupController {
  constructor(private readonly signUpService: SignUpService) {}
  @Post()
  @HttpCode(200)
  @SignUpDocs()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.signUpService.signUp(createUserDto, 'user');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin')
  @HttpCode(200)
  @SignUpAdminDocs()
  signUpAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    const creatorRole = req.user.role;
    return this.signUpService.signUp(createUserDto, creatorRole);
  }
}
