import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteAccountDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Deletar conta do usuário' }),
    ApiResponse({ status: 200, description: 'Conta deletada com sucesso.' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({ status: 403, description: 'Acesso negado.' }),
  );
}
