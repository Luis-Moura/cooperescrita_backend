import { IsNumber, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCorrecaoHighlightsDto {
  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @IsNumber()
  @IsNotEmpty()
  endIndex: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  color: string;
}
