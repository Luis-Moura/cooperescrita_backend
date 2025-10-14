import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRedacaoCommentDto {
  @ApiProperty({
    description: 'Index inicial do comentário',
    required: false,
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  startIndex?: number;

  @ApiProperty({
    description:
      'Index final do comentário(obrigatoriamente deve ser maior que o startIndex)',
    required: false,
    example: '10',
  })
  @IsNumber()
  @IsOptional()
  endIndex?: number;

  @ApiProperty({
    description: 'O texto do comentário, escrito pelo usuário',
    required: false,
    minLength: 30,
    maxLength: 500,
    example:
      'Eu acho que nesse trecho da redação eu não fui muito bem, então ao corretor pode focar mais aqui.',
  })
  @IsString()
  @IsOptional()
  @MinLength(30)
  @MaxLength(500)
  comentario?: string;

  @ApiProperty({
    description: 'Cor do comentário',
    required: false,
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  @MinLength(7)
  @MaxLength(7)
  color: string;
}
