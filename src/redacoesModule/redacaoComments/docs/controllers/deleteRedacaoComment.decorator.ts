import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteRedacaoCommentDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Excluir um comentário de uma redação',
      description:
        'Remove um comentário específico de uma redação. Somente o autor do comentário pode excluí-lo.',
    }),
    ApiParam({
      name: 'redacaoId',
      type: 'number',
      description: 'ID da redação contendo o comentário',
      required: true,
      example: 1,
    }),
    ApiParam({
      name: 'commentId',
      type: 'number',
      description: 'ID do comentário a ser excluído',
      required: true,
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Comentário excluído com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Requisição inválida - Erros de validação:\n' +
        '- ID da redação inválido\n' +
        '- ID do comentário inválido',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - O usuário não é o autor do comentário',
    }),
    ApiResponse({
      status: 404,
      description:
        'Não encontrado:\n' +
        '- Usuário não encontrado\n' +
        '- Redação não encontrada\n' +
        '- Comentário não encontrado',
    }),
  );
}
