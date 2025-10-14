import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class createDefinitiveRedacaoDto {
  @ApiProperty({
    description: 'Título da redação',
    required: false,
    minLength: 0,
    maxLength: 200,
    example: '"Minha Redação"',
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  title: string;

  @ApiProperty({
    description: 'Tema da redação',
    required: true,
    minLength: 5,
    maxLength: 200,
    example: '"Tema da Redação"',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  topic: string;

  @ApiProperty({
    description: 'Conteúdo da redação',
    required: true,
    minLength: 700,
    maxLength: 4000,
    example: '"Conteúdo da Redação (tamanho min. 700 e tamanho máx. 4000)"',
  })
  @IsNotEmpty()
  @IsString()
  @Length(700, 4000)
  content: string;
}
