import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function GetRedacoesDecoratorsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Buscar todas as redações do usuário autenticado',
    }),
    ApiResponse({ status: 200, description: 'Redações encontradas.' }),
    ApiResponse({
      status: 400,
      description: 'Parâmetros de limit e offset inválidos.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou redações não encontradas.',
    }),
    ApiQuery({
      name: 'limit',
      required: true,
      description: 'Número máximo de redações a serem retornadas',
    }),
    ApiQuery({
      name: 'offset',
      required: true,
      description:
        'Número de redações a serem puladas antes de começar a coletar os resultados',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      enum: ['crescente', 'decrescente'],
      description: 'Ordem dos resultados',
    }),
    ApiQuery({
      name: 'statusEnvio',
      required: false,
      enum: ['rascunho', 'enviada'],
      description: 'Status de envio das redações',
    }),
    ApiQuery({
      name: 'statusCorrecao',
      required: false,
      enum: ['corrigidas', 'nao-corrigidas'],
      description: 'Status de correção das redações',
    }),
  );
}
