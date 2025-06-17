import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SignUpAdminDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar um novo administrador' }),
    ApiResponse({
      status: 200,
      description: 'Administrador registrado com sucesso.',
    }),
    ApiResponse({ status: 409, description: 'Usuário já existe.' }),
    ApiResponse({
      status: 403,
      description:
        'Apenas administradores podem criar contas de administrador.',
    }),
  );
}
