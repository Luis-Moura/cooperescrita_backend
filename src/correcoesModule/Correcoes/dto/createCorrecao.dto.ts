import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

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
}
