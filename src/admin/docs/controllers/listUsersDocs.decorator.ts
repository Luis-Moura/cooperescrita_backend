import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function ListUsersDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Listar usuários com paginação e filtros' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número da página (começa em 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Quantidade de itens por página',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Termo para buscar em nome e email',
    }),
    ApiQuery({
      name: 'role',
      required: false,
      enum: ['user', 'admin'],
      description: 'Filtrar por perfil de usuário',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuários retornada com sucesso',
      schema: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string', enum: ['user', 'admin'] },
                verified: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                active: { type: 'boolean' },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Requer perfil de administrador',
    }),
  );
}
