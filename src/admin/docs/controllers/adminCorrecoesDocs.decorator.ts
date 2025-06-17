import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

export function AdminViewCorrecaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Visualizar qualquer correção (admin)',
      description: 'Permite que administradores visualizem qualquer correção',
    }),
    ApiResponse({
      status: 200,
      description: 'Correção retornada com dados completos',
    }),
    ApiResponse({
      status: 404,
      description: 'Correção não encontrada',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}

export function AdminDeleteCorrecaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deletar correção (admin)',
      description: 'Permite que administradores deletem qualquer correção',
    }),
    ApiResponse({
      status: 200,
      description: 'Correção deletada com sucesso',
    }),
    ApiResponse({
      status: 404,
      description: 'Correção não encontrada',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}

export function AdminListCorrecoesDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar todas as correções (admin)',
      description: 'Lista todas as correções com filtros administrativos',
    }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({ name: 'offset', required: false, type: Number, example: 0 }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['enviado', 'rascunho'],
    }),
    ApiQuery({ name: 'corretorId', required: false, type: String }),
    ApiQuery({ name: 'redacaoId', required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Lista de correções retornada com sucesso',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}
