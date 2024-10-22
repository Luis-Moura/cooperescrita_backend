import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { UsersService } from './users.service';
import { FindByNameDto } from './dto/find-by-name.dto';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-email')
  async findByEmail(@Body() findByEmailDto: FindByEmailDto) {
    return await this.usersService.findByEmail(findByEmailDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/find-by-name')
  async findByName(@Body() findByNameDto: FindByNameDto) {
    return await this.usersService.findByName(findByNameDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/admin/delete-user-by-email')
  async deleteUserByEmail(@Body() findByEmailDto: FindByEmailDto) {
    return await this.usersService.deleteUserByEmail(findByEmailDto);
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
