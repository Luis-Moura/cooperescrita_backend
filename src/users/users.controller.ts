import { Body, Controller, Get } from '@nestjs/common';
import { IFindByEmail } from './models/findByEmail.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findByEmail(@Body() data: IFindByEmail) {
    return await this.usersService.findByEmail(data);
  }
}
