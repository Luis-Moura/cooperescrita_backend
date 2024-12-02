import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class createDraftRedacaoDto {
  @ApiProperty({
    description: 'Título da redação',
    required: false,
    minLength: 0,
    maxLength: 100,
    example: '"Minha Redação"',
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  title: string;

  @ApiProperty({
    description: 'Tema da redação',
    required: true,
    minLength: 5,
    maxLength: 100,
    example: '"Tema da Redação"',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  topic: string;

  @ApiProperty({
    description: 'Conteúdo da redação',
    required: false,
    minLength: 0,
    maxLength: 4000,
    example: '"Conteúdo da Redação (tamanho máx. 4000)"',
  })
  @IsOptional()
  @IsString()
  @Length(0, 4000)
  content: string;
}
