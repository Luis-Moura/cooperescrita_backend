import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token para obter novo access token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
