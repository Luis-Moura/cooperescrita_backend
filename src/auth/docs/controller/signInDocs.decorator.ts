import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SignInDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Fazer login do usuário' }),
    ApiResponse({ status: 200, description: 'Login bem-sucedido.' }),
    ApiResponse({ status: 401, description: 'Credenciais inválidas.' }),
    ApiResponse({
      status: 403,
      description: 'Conta temporariamente bloqueada.',
    }),
  );
}
