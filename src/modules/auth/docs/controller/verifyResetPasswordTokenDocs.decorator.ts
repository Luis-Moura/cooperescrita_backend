import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function VerifyResetPasswordTokenDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Verificar validade do token JWT' }),
    ApiResponse({ status: 200, description: 'Token é válido.' }),
    ApiResponse({ status: 400, description: 'Token inválido.' }),
  );
}
