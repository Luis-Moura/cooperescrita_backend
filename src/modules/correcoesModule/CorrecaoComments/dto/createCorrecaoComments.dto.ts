import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCorrecaoCommentsDto {
  @ApiProperty({
    description: 'Texto do comentário para a correção',
    required: true,
    example:
      'Este trecho precisa melhorar a argumentação e desenvolver melhor as ideias apresentadas. Sugiro incluir mais dados que embasem seu ponto de vista.',
    minLength: 30,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(500)
  comment: string;

  @ApiProperty({
    description: 'Índice inicial do texto onde o comentário começa',
    required: true,
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @ApiProperty({
    description: 'Índice final do texto onde o comentário termina',
    required: true,
    example: 150,
  })
  @IsNumber()
  @IsNotEmpty()
  endIndex: number;
}
