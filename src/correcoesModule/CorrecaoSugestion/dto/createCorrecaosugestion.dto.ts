import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateCorrecaoSugestionDto {
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
  sugestionText: string;
}
