import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteCorrecaoHighlightDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deletar um destaque específico de uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção que contém o destaque',
      type: 'number',
    }),
    ApiParam({
      name: 'highlightId',
      required: true,
      description: 'ID do destaque a ser deletado',
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Destaque deletado com sucesso.',
    }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 403,
      description: 'Usuário não tem permissão para deletar este destaque.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário, correção ou destaque não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
