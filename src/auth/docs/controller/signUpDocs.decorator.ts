import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SignUpDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar um novo usuário' }),
    ApiResponse({
      status: 200,
      description: 'Usuário registrado com sucesso.',
    }),
    ApiResponse({ status: 409, description: 'Usuário já existe.' }),
    ApiResponse({
      status: 403,
      description:
        'Apenas administradores podem criar contas de administrador.',
    }),
  );
}
