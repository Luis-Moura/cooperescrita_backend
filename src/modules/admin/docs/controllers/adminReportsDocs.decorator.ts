import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

export function AdminReportsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar reports administrativos',
      description: 'Acesso exclusivo para administradores',
    }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({ name: 'offset', required: false, type: Number, example: 0 }),
    ApiResponse({
      status: 200,
      description: 'Lista de reports com dados completos para análise',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}

export function AdminResolveReportDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Resolver report administrativo',
      description: 'Permite que administradores resolvam reports e tomem ações',
    }),
    ApiResponse({
      status: 200,
      description: 'Report resolvido com sucesso',
    }),
    ApiResponse({
      status: 404,
      description: 'Report não encontrado',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}

export function AdminReportsStatsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Estatísticas de reports',
      description: 'Dashboard com estatísticas administrativas de reports',
    }),
    ApiResponse({
      status: 200,
      description: 'Estatísticas de reports retornadas com sucesso',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Privilégios administrativos necessários',
    }),
  );
}
