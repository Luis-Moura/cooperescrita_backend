import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class Verify2FACodeDto {
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
