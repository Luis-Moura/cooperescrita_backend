import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function GetCorrecaoHighlightsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obter todos os destaques de uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção',
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de destaques retornada com sucesso.',
    }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou correção não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
