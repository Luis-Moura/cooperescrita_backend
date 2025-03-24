import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteCorrecaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deletar uma correção pelo ID',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção a ser deletada',
      type: 'number',
    }),
    ApiResponse({ status: 200, description: 'Correção deletada com sucesso.' }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou correção não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
