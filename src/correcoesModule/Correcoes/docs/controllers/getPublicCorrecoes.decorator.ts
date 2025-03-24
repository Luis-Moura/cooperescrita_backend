import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function GetPublicCorrecoesDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Buscar correções públicas para uma redação específica',
    }),
    ApiParam({
      name: 'redacaoId',
      required: true,
      description: 'ID da redação para buscar as correções',
      type: 'number',
    }),
    ApiQuery({
      name: 'limit',
      required: true,
      description: 'Número máximo de correções a serem retornadas',
      type: 'number',
    }),
    ApiQuery({
      name: 'offset',
      required: true,
      description: 'Número de correções a serem puladas',
      type: 'number',
    }),
    ApiQuery({
      name: 'redacaoId',
      required: false,
      description:
        'ID da redação para filtrar (redundante com o parâmetro de rota)',
      type: 'number',
    }),
    ApiQuery({
      name: 'ordemLancamento',
      required: false,
      description: 'Ordem de lançamento das correções por data',
      enum: ['asc', 'desc'],
    }),
    ApiQuery({
      name: 'likes',
      required: false,
      description: 'Ordenação por quantidade de likes',
      enum: ['asc', 'desc'],
    }),
    ApiResponse({
      status: 200,
      description: 'Correções públicas encontradas.',
    }),
    ApiResponse({
      status: 400,
      description: 'ID inválido ou parâmetros inválidos.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário não encontrado ou correções não encontradas.',
    }),
  );
}
