import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function GetCorrecaoByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Buscar uma correção específica pelo ID',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção a ser buscada',
      type: 'number',
    }),
    ApiResponse({ status: 200, description: 'Correção encontrada.' }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou correção não encontrados.',
    }),
  );
}
