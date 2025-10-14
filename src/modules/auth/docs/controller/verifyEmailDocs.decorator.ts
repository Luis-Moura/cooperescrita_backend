import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function VerifyEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Verificar conta de usuário' }),
    ApiResponse({ status: 200, description: 'Email verificado com sucesso.' }),
    ApiResponse({ status: 400, description: 'Token inválido ou expirado.' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({ status: 409, description: 'Usuário já verificado.' }),
  );
}
