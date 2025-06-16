import { ApiProperty } from '@nestjs/swagger';

export class CorrecaoReportEntityDoc {
  @ApiProperty({
    description: 'ID único do report',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Motivo do report',
    enum: ['conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro'],
    example: 'conteudo_inadequado',
  })
  motivo: string;

  @ApiProperty({
    description: 'Descrição adicional do report',
    nullable: true,
    maxLength: 500,
    example: 'Esta correção contém conteúdo inadequado...',
  })
  descricao?: string;

  @ApiProperty({
    description: 'Status do report',
    enum: ['pendente', 'analisado', 'rejeitado'],
    example: 'pendente',
  })
  status: string;

  @ApiProperty({
    description: 'Data de criação do report',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
