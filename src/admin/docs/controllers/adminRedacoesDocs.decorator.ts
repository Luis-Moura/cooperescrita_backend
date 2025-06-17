import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

export function AdminViewRedacaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Visualizar qualquer redação (admin)',
      description:
        'Permite que administradores visualizem qualquer redação, pública ou privada',
    }),
    ApiResponse({
      status: 200,
      description: 'Redação retornada com dados completos',
    }),
    ApiResponse({
      status: 404,
      description: 'Redação não encontrada',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}

export function AdminDeleteRedacaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deletar redação (admin)',
      description: 'Permite que administradores deletem qualquer redação',
    }),
    ApiResponse({
      status: 200,
      description: 'Redação deletada com sucesso',
    }),
    ApiResponse({
      status: 404,
      description: 'Redação não encontrada',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}

export function AdminListRedacoesDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar todas as redações (admin)',
      description: 'Lista todas as redações com filtros administrativos',
    }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({ name: 'offset', required: false, type: Number, example: 0 }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['enviado', 'rascunho'],
    }),
    ApiQuery({ name: 'userId', required: false, type: String }),
    ApiQuery({ name: 'search', required: false, type: String }),
    ApiResponse({
      status: 200,
      description: 'Lista de redações retornada com sucesso',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}

export function AdminToggleRedacaoStatusDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Alterar status de redação (admin)',
      description:
        'Permite que administradores alterem o status de uma redação',
    }),
    ApiResponse({
      status: 200,
      description: 'Status da redação alterado com sucesso',
    }),
    ApiResponse({
      status: 404,
      description: 'Redação não encontrada',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}
