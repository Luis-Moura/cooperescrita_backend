import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function GetDashboardInfoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('dashboard'),
    ApiOperation({
      summary: 'Obter informações do dashboard do usuário autenticado',
      description: `\nRetorna estatísticas gerais do usuário, como quantidade de redações criadas, correções recebidas, correções feitas e a última atividade (redação ou correção).\n`,
    }),
    ApiResponse({
      status: 200,
      description: 'Informações do dashboard retornadas com sucesso.',
      schema: {
        type: 'object',
        properties: {
          essayCreatedCount: { type: 'number', example: 6 },
          correctionRecieivedCount: { type: 'number', example: 6 },
          correctionCreatedCount: { type: 'number', example: 5 },
          lastActivity: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'number', example: 43 },
              type: {
                type: 'string',
                enum: ['redacao', 'correcao'],
                example: 'correcao',
              },
              topic: {
                type: 'string',
                example: 'Tema da redação',
                nullable: true,
              },
              title: {
                type: 'string',
                example: 'Título da redação',
                nullable: true,
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-07-16T04:10:11.032Z',
              },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Não autorizado.' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
