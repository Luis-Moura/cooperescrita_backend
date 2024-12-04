import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ForgotPasswordDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Solicitar redefinição de senha' }),
    ApiResponse({
      status: 200,
      description: 'Email enviado com instruções para redefinir a senha.',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
  );
}
