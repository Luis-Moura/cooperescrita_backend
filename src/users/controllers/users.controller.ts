import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { FindByEmailDto } from '../dto/find-by-email.dto';
import { UsersService } from '../services/users.service';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-email')
  async findByEmail(@Body() findByEmailDto: FindByEmailDto) {
    return await this.usersService.findByEmail(findByEmailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/users/change-password')
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
