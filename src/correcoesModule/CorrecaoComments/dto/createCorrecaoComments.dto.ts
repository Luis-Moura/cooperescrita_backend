import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCorrecaoCommentsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  @MaxLength(500)
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @IsNumber()
  @IsNotEmpty()
  endIndex: number;
}
