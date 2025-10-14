import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCorrecaoReportDto } from '../../dto/createCorrecaoReport.dto';

export function CreateCorrecaoReportDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Reportar uma correção',
      description:
        'Permite reportar uma correção por conteúdo inadequado, spam ou outros motivos',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção a ser reportada',
      type: 'number',
      example: 1,
    }),
    ApiBody({
      type: CreateCorrecaoReportDto,
      description: 'Dados do report',
      examples: {
        exemplo1: {
          summary: 'Report por conteúdo inadequado',
          value: {
            motivo: 'conteudo_inadequado',
            descricao: 'Esta correção contém comentários inadequados',
          },
        },
        exemplo2: {
          summary: 'Report por conteúdo ofensivo',
          value: {
            motivo: 'ofensivo',
            descricao:
              'Correção contém linguagem ofensiva direcionada ao autor',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Report criado com sucesso',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Report criado com sucesso' },
          reportId: { type: 'string', format: 'uuid' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos fornecidos',
    }),
    ApiResponse({
      status: 403,
      description: 'Você não pode reportar sua própria correção',
    }),
    ApiResponse({
      status: 404,
      description: 'Correção não encontrada ou não está pública',
    }),
    ApiResponse({
      status: 409,
      description: 'Você já reportou esta correção',
    }),
    ApiResponse({
      status: 429,
      description: 'Muitas tentativas - limite de 5 reports por minuto',
    }),
  );
}
