import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRedacaoCommentsDto {
  @ApiProperty({
    description: 'Index inicial do comentário',
    required: true,
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @ApiProperty({
    description:
      'Index final do comentário(obrigatoriamente deve ser maior que o startIndex)',
    required: true,
    example: '10',
  })
  @IsNumber()
  @IsNotEmpty()
  endIndex: number;

  @ApiProperty({
    description: 'O texto do comentário, escrito pelo usuário',
    required: true,
    minLength: 30,
    maxLength: 500,
    example:
      'Eu acho que nesse trecho da redação eu não fui muito bem, então ao corretor pode focar mais aqui.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(500)
  comentario: string;

  @ApiProperty({
    description: 'Cor do comentário',
    required: true,
    example: '#FF5733',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(7)
  color: string;
}
