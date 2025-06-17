import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminRedacoesPaginationDto {
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
    description: 'Status da redação',
    enum: ['enviado', 'rascunho'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['enviado', 'rascunho'])
  status?: 'enviado' | 'rascunho';

  @ApiProperty({
    description: 'ID do usuário para filtrar',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Termo de busca',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
