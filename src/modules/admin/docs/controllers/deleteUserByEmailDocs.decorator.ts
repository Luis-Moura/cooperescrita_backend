import { applyDecorators } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteUserByEmailDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Deletar usuário por email' }),
    ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({ status: 403, description: 'Acesso negado.' }),
  );
}
