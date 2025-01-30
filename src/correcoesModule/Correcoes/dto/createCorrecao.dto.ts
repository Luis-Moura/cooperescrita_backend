import { IsNumber, IsOptional } from 'class-validator';

export class CreateCorrecaoDto {
  @IsNumber()
  redacaoId: number;

  @IsNumber()
  @IsOptional()
  correcaoId?: number;
}
