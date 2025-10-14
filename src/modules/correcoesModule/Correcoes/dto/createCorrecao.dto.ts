import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateCorrecaoDto {
  @ApiProperty({
    description: 'ID da redação que será corrigida',
    required: true,
    example: 1,
  })
  @IsNumber()
  redacaoId: number;

  @ApiProperty({
    description:
      'ID de uma correção rascunho existente (opcional, apenas para atualização)',
    required: false,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  correcaoId?: number;

  @ApiProperty({
    description: 'Nota atribuída pelo corretor à redação (0 a 1000)',
    required: false,
    minimum: 0,
    maximum: 1000,
    example: 850,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1000)
  nota?: number;

  @ApiProperty({
    description: 'Comentário final do corretor sobre a redação',
    required: false,
    example: 'Excelente texto, demonstra domínio do tema e boa argumentação.',
  })
  @IsString()
  @IsOptional()
  comentario_final?: string;
}
