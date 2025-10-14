import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateRedacaoReportDto } from '../../dto/createRedacaoReport.dto';

export function CreateRedacaoReportDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Reportar uma redação',
      description:
        'Permite reportar uma redação por conteúdo inadequado, spam ou outros motivos',
    }),
    ApiParam({
      name: 'redacaoId',
      required: true,
      description: 'ID da redação a ser reportada',
      type: 'number',
      example: 1,
    }),
    ApiBody({
      type: CreateRedacaoReportDto,
      description: 'Dados do report',
      examples: {
        exemplo1: {
          summary: 'Report por conteúdo inadequado',
          value: {
            motivo: 'conteudo_inadequado',
            descricao:
              'Esta redação contém linguagem ofensiva e conteúdo inadequado',
          },
        },
        exemplo2: {
          summary: 'Report por spam',
          value: {
            motivo: 'spam',
            descricao: 'Redação contém propaganda não relacionada ao tema',
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
      description: 'Você não pode reportar sua própria redação',
    }),
    ApiResponse({
      status: 404,
      description: 'Redação não encontrada ou não está pública',
    }),
    ApiResponse({
      status: 409,
      description: 'Você já reportou esta redação',
    }),
    ApiResponse({
      status: 429,
      description: 'Muitas tentativas - limite de 5 reports por minuto',
    }),
  );
}
