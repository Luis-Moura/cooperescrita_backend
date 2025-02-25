import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

export function GetRedacaoCommentByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obter um comentário específico de uma redação',
      description:
        'Recupera um único comentário pelo seu ID em uma redação específica',
    }),
    ApiParam({
      name: 'redacaoId',
      type: 'number',
      description: 'ID da redação que contém o comentário',
      required: true,
      example: 1,
    }),
    ApiParam({
      name: 'commentId',
      type: 'number',
      description: 'ID do comentário a ser recuperado',
      required: true,
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Comentário recuperado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Requisição inválida - Erros de validação:\n' +
        '- ID da redação inválido\n' +
        '- ID do comentário inválido',
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
