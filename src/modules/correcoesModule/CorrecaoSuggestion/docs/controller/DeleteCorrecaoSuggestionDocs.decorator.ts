import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteCorrecaoSuggestionDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deletar uma sugestão de correção específica',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção que contém a sugestão',
      type: 'number',
    }),
    ApiParam({
      name: 'suggestionId',
      required: true,
      description: 'ID da sugestão a ser deletada',
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Sugestão de correção deletada com sucesso.',
    }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 403,
      description: 'Usuário não tem permissão para deletar esta sugestão.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário, correção ou sugestão não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
