import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function Verify2FACodeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verificar código de autenticação de dois fatores',
    }),
    ApiResponse({ status: 200, description: 'Código verificado com sucesso.' }),
    ApiResponse({
      status: 400,
      description: 'Código de verificação inválido ou expirado.',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
  );
}
