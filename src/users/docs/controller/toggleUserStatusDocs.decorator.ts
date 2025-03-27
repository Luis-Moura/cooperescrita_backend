import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ToggleUserStatusDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Alterna o status de ativação da conta do usuário',
    }),
    ApiParam({ name: 'userId', description: 'ID do usuário', type: 'string' }),
    ApiResponse({
      status: 200,
      description: 'Status do usuário alterado com sucesso',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User activated successfully' },
          active: { type: 'boolean', example: true },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado - Requer perfil de administrador',
    }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
    ApiResponse({
      status: 403,
      description:
        'Operação não permitida - Não é possível modificar o administrador principal ou outro administrador sem permissões adequadas',
    }),
  );
}
