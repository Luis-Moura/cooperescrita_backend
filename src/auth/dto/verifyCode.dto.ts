import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Código de verificação',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  verificationCode: string;
}
