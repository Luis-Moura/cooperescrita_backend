import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function PostResetPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Redefinir senha do usuário' }),
    ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' }),
    ApiResponse({ status: 400, description: 'Token ou senha inválidos.' }),
    ApiResponse({
      status: 409,
      description: 'A nova senha não pode ser igual à anterior.',
    }),
  );
}
