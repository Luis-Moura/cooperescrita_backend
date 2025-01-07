import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function deleteRedacaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Deletar uma redação' }),
    ApiParam({
      name: 'redacaoId',
      required: true,
      description: 'Id da redação a ser deletada',
    }),
    ApiResponse({ status: 200, description: 'Redação deletada com sucesso.' }),
    ApiResponse({ status: 404, description: 'Redação não encontrada.' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
