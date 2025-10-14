import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteCorrecaoFeedbackDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deletar um feedback específico de uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção que contém o feedback',
      type: 'number',
    }),
    ApiParam({
      name: 'feedbackId',
      required: true,
      description: 'ID do feedback a ser deletado',
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Feedback deletado com sucesso.',
    }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 404,
      description:
        'Usuário, correção ou feedback não encontrados, ou usuário não tem permissão para deletar este feedback.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
