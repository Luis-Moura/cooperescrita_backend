import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminFiltersDto {
  @ApiProperty({
    description: 'Status do report',
    enum: ['pendente', 'analisado', 'rejeitado'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['pendente', 'analisado', 'rejeitado'])
  status?: string;

  @ApiProperty({
    description: 'Motivo do report',
    enum: ['conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro'])
  motivo?: string;

  @ApiProperty({
    description: 'Data inicial (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dataInicial?: string;

  @ApiProperty({
    description: 'Data final (ISO string)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dataFinal?: string;

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
}
