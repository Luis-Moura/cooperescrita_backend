import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function GetCorrecaoFeedbackByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obter um feedback específico de uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção',
      type: 'number',
    }),
    ApiParam({
      name: 'feedbackId',
      required: true,
      description: 'ID do feedback a ser obtido',
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Feedback retornado com sucesso.',
    }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário, correção ou feedback não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
