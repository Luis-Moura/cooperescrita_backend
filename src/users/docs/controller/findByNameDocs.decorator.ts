import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindByNameDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Buscar usuário por nome' }),
    ApiResponse({ status: 200, description: 'Usuário encontrado.' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({ status: 403, description: 'Acesso negado.' }),
  );
}
