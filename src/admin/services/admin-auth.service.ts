import { Injectable } from '@nestjs/common';
import { SignUpService } from 'src/auth/services/signup.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class AdminAuthService {
  constructor(private readonly signUpService: SignUpService) {}

  async signUpAdmin(createUserDto: CreateUserDto, creatorRole: string) {
    // Forçar role como admin para garantir que apenas admins sejam criados
    const adminUserDto = { ...createUserDto, role: 'admin' };

    await this.signUpService.signUp(adminUserDto, creatorRole);

    return {
      message:
        'Admin registered successfully. Please check your email for verification instructions.',
    };
  }
}
