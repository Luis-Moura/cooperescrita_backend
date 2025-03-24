import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInDocs } from '../docs/controller/signInDocs.decorator';
import { SignInDto } from '../dto/sign-in.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SignInService } from '../services/signin.service';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth/signin')
export class SigninController {
  constructor(private signInService: SignInService) {}

  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('')
  @HttpCode(200)
  @SignInDocs()
  signIn(@Body() signInDto: SignInDto) {
    return this.signInService.signIn(signInDto);
  }
}
