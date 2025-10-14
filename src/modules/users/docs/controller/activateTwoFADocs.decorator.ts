import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ActivateTwoFADocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Ativar autenticação de dois fatores' }),
    ApiResponse({
      status: 200,
      description: 'Autenticação de dois fatores ativada.',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({
      status: 409,
      description: 'Autenticação de dois fatores já ativada.',
    }),
  );
}
