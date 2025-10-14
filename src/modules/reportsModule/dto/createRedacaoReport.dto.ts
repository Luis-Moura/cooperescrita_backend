import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRedacaoReportDto {
  @ApiProperty({
    description: 'Motivo do report',
    enum: ['conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro'],
    example: 'conteudo_inadequado',
  })
  @IsEnum(['conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro'])
  motivo: string;

  @ApiProperty({
    description: 'Descrição adicional do report',
    required: false,
    maxLength: 500,
    example: 'Esta redação contém conteúdo ofensivo...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricao?: string;
}
