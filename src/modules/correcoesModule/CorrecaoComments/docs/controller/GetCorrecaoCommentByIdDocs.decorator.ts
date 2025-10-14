import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function GetCorrecaoCommentByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obter um comentário específico de uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção',
      type: 'number',
    }),
    ApiParam({
      name: 'commentId',
      required: true,
      description: 'ID do comentário a ser obtido',
      type: 'number',
    }),
    ApiResponse({
      status: 200,
      description: 'Comentário retornado com sucesso.',
    }),
    ApiResponse({ status: 400, description: 'ID inválido.' }),
    ApiResponse({
      status: 403,
      description: 'Usuário não tem permissão para visualizar este comentário.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário, correção ou comentário não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
  );
}
