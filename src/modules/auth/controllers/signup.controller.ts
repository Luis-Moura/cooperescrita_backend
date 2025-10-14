import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDocs } from '../docs/controller/signUpDocs.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
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
}
