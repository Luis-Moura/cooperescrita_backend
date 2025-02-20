import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRedacaoCommentDto {
  @IsNumber()
  @IsOptional()
  startIndex?: number;

  @IsNumber()
  @IsOptional()
  endIndex?: number;

  @IsString()
  @IsOptional()
  @MinLength(30)
  @MaxLength(500)
  comentario?: string;
}
