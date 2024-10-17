import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IChangePassword } from './models/changePassword.interface';
import { IFindByEmail } from './models/findByEmail.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findByEmail(@Body() data: IFindByEmail) {
    return await this.usersService.findByEmail(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(@Body() data: IChangePassword, @Request() req) {
    const email = req.user.email;

    const { oldPassword, newPassword } = data;

    const newData = { email, oldPassword, newPassword };

    return await this.usersService.changePassword(newData);
  }
}
