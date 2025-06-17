import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class ResolveReportDto {
  @ApiProperty({
    description: 'Ação a ser tomada no report',
    enum: ['analisado', 'rejeitado'],
    example: 'analisado',
  })
  @IsEnum(['analisado', 'rejeitado'])
  acao: 'analisado' | 'rejeitado';

  @ApiProperty({
    description: 'Observações do administrador',
    required: false,
    maxLength: 1000,
    example: 'Report analisado e conteúdo considerado adequado',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  observacoes?: string;

  @ApiProperty({
    description: 'Se deve deletar o conteúdo reportado',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  deletarConteudo?: boolean;
}
