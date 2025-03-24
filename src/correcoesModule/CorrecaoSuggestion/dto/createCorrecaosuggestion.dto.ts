import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateCorrecaoSuggestionDto {
  @ApiProperty({
    description: 'Índice inicial do texto onde a sugestão começa',
    required: true,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @ApiProperty({
    description: 'Índice final do texto onde a sugestão termina',
    required: true,
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  endIndex: number;

  @ApiProperty({
    description: 'Texto original que será substituído',
    required: true,
    example: 'texto com erro',
  })
  @IsNotEmpty()
  @IsString()
  originalText: string;

  @ApiProperty({
    description: 'Texto sugerido como correção',
    required: true,
    example: 'texto corrigido',
  })
  @IsNotEmpty()
  @IsString()
  suggestionText: string;
}
