import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function UpdateProfileDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Atualizar dados do perfil do usuário' }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Novo Nome do Usuário' },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil atualizado com sucesso',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Profile updated successfully' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
    ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' }),
  );
}
