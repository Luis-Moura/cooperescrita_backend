import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function GetCorrecaoHighlightByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obter um destaque específico de uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção',
      type: 'number',
    }),
    ApiParam({
      name: 'highlightId',
      required: true,
      description: 'ID do destaque a ser obtido',
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Destaque retornado com sucesso.',
    }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário, correção ou destaque não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
