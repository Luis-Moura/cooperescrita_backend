import { UsersService } from '../services/users.service';

export class AdminController {
  constructor(private readonly usersService: UsersService) {}
}
