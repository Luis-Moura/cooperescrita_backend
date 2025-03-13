import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetCorrecoesDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(49)
  offset: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  redacaoId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc']) // Validação para aceitar apenas 'asc' ou 'desc'
  ordemLancamento?: 'asc' | 'desc'; // ordem de lançamento da correção por data, podendo ser 'asc' ou 'desc'

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc']) // Validação para aceitar apenas 'asc' ou 'desc'
  likes?: 'asc' | 'desc'; // mais ou menos likes, podendo ser 'asc' ou 'desc'
}
