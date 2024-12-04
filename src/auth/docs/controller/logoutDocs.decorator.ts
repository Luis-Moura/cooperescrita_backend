import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function LogoutDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Fazer logout do usuário' }),
    ApiResponse({ status: 200, description: 'Logout bem-sucedido.' }),
    ApiResponse({ status: 400, description: 'Token inválido.' }),
  );
}
