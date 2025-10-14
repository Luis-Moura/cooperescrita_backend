import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminCorrecoesPaginationDto {
  @ApiProperty({
    description: 'Número de itens por página',
    required: false,
    default: 20,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Offset para paginação',
    required: false,
    default: 0,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiProperty({
    description: 'Status da correção',
    enum: ['enviado', 'rascunho'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['enviado', 'rascunho'])
  status?: 'enviado' | 'rascunho';

  @ApiProperty({
    description: 'ID do corretor para filtrar',
    required: false,
  })
  @IsOptional()
  @IsString()
  corretorId?: string;

  @ApiProperty({
    description: 'ID da redação para filtrar',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  redacaoId?: number;
}
