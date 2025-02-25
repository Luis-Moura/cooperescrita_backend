import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

export function GetRedacaoCommentsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obter todos os comentários de uma redação',
      description:
        'Recupera todos os comentários associados a uma redação específica, ordenados pelo índice inicial',
    }),
    ApiParam({
      name: 'redacaoId',
      type: 'number',
      description: 'ID da redação para obter os comentários',
      required: true,
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description:
        'Comentários recuperados com sucesso. Retorna um array de comentários ordenados por startIndex.',
    }),
    ApiResponse({
      status: 400,
      description: 'Requisição inválida - ID da redação fornecido é inválido',
    }),
    ApiResponse({
      status: 404,
      description:
        'Não encontrado:\n' +
        '- Usuário não encontrado\n' +
        '- Redação não encontrada',
    }),
  );
}
