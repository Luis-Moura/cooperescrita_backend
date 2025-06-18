import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { SignUpAdminDocs } from '../docs/controllers/signUpAdminDocs.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminAuthService } from '../services/admin-auth.service';

@ApiTags('admin')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('signup')
  @HttpCode(200)
  @SignUpAdminDocs()
  async signUpAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    const creatorRole = req.user.role;
    const creatorEmail = req.user.email;

    return await this.adminAuthService.signUpAdmin(
      createUserDto,
      creatorRole,
      creatorEmail,
    );
  }
}
