import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DesativateTwoFaDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Desativar autenticação de dois fatores' }),
    ApiResponse({
      status: 200,
      description: 'Autenticação de dois fatores desativada.',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({
      status: 409,
      description: 'Autenticação de dois fatores já desativada.',
    }),
    ApiResponse({ status: 403, description: 'Acesso negado.' }),
  );
}
