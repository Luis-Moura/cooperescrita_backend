import { ApiProperty } from '@nestjs/swagger';
import {
  MinLength,
  MaxLength,
  Matches,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de redefinição de senha' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    minLength: 8,
    maxLength: 20,
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
