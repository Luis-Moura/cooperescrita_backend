import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ChangePasswordDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Alterar senha usando a a senha atual' }),
    ApiResponse({ status: 200, description: 'Senha alterada com sucesso.' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({ status: 400, description: 'Senha incorreta.' }),
  );
}
