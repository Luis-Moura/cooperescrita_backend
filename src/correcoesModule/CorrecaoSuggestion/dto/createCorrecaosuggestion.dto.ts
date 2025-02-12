import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateCorrecaoSuggestionDto {
  @IsNumber()
  @IsNotEmpty()
  startIndex: number;

  @IsNumber()
  @IsNotEmpty()
  endIndex: number;

  @IsNotEmpty()
  @IsString()
  originalText: string;

  @IsNotEmpty()
  @IsString()
  suggestionText: string;
}
