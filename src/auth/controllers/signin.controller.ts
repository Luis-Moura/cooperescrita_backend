import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInDocs } from '../docs/controller/signInDocs.decorator';
import { SignInDto } from '../dto/sign-in.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SignInService } from '../services/signin.service';

@ApiTags('auth')
@Controller('auth/signin')
export class SigninController {
  constructor(private signInService: SignInService) {}

  @UseGuards(LocalAuthGuard)
  @Post('')
  @HttpCode(200)
  @SignInDocs()
  signIn(@Body() signInDto: SignInDto) {
    return this.signInService.signIn(signInDto);
  }
}
