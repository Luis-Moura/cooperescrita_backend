import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function GetRedacaoByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Buscar uma redação específica pelo ID',
    }),
    ApiParam({
      name: 'redacaoId',
      required: true,
      description: 'Id da redação a ser buscada',
    }),
    ApiResponse({ status: 200, description: 'Redação encontrada.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou redação não encontrados.',
    }),
    ApiResponse({ status: 400, description: 'Id inválido.' }),
  );
}
