import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetRedacaoCommentsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar os comentários de uma redação',
    }),
    ApiResponse({
      status: 200,
      description: 'Comentários listados com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuario ou Redação não encontrada.',
    }),
    ApiResponse({
      status: 401,
      description: 'Usuário não autenticado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor.',
    }),
  );
}
