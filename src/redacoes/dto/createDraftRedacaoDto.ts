import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class createDraftRedacaoDto {
  @ApiProperty({ description: 'Título da redação', required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Tema da redação', required: true })
  @IsNotEmpty()
  @IsString()
  topic: string;

  @ApiProperty({
    description: 'Conteúdo da redação',
    required: false,
    minLength: 0,
    maxLength: 4000,
  })
  @IsOptional()
  @IsString()
  @Length(0, 4000)
  content: string;
}
