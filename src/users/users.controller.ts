import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //implementar um role de admin para somente administradores poderem acessar
  @Get()
  async findByEmail(@Body() findByEmailDto: FindByEmailDto) {
    return await this.usersService.findByEmail(findByEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    const email = req.user.email;

    return await this.usersService.changePassword({
      email,
      ...changePasswordDto,
    });
  }
}
