import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRedacaoCommentsDto {
  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @IsNumber()
  @IsNotEmpty()
  endIndex: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(500)
  comentario: string;
}
