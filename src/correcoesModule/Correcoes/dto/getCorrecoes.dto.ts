import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Número máximo de correções a serem retornadas',
    required: true,
    minimum: 1,
    maximum: 50,
    example: 10,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit: number;

  @ApiProperty({
    description:
      'Número de correções a serem puladas antes de começar a coletar os resultados',
    required: true,
    minimum: 0,
    maximum: 49,
    example: 0,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(49)
  offset: number;

  @ApiProperty({
    description: 'ID da redação para filtrar as correções',
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  redacaoId?: number;

  @ApiProperty({
    description: 'Ordem de lançamento das correções por data',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  ordemLancamento?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Ordenação por quantidade de likes',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  likes?: 'asc' | 'desc';
}
