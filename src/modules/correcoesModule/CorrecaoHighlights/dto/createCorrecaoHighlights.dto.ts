import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCorrecaoHighlightsDto {
  @ApiProperty({
    description: 'Índice inicial do texto onde o destaque começa',
    required: true,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @ApiProperty({
    description: 'Índice final do texto onde o destaque termina',
    required: true,
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  endIndex: number;

  @ApiProperty({
    description: 'Código de cor do destaque (em formato hex ou nome da cor)',
    required: true,
    example: '#FF0000',
    minLength: 1,
    maxLength: 10,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  color: string;
}
