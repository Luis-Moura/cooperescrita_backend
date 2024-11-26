import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class createDefinitiveRedacaoDto {
  @ApiProperty({ description: 'Título da redação', required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Tema da redação' })
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiProperty({
    description: 'Conteúdo da redação',
    minLength: 700,
    maxLength: 4000,
  })
  @IsNotEmpty()
  @IsString()
  @Length(700, 4000)
  content: string;
}
