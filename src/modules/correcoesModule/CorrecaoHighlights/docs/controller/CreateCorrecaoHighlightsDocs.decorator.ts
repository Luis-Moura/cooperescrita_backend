import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCorrecaoHighlightsDto } from '../../dto/createCorrecaoHighlights.dto';

export function CreateCorrecaoHighlightsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar um destaque em uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção onde o destaque será adicionado',
      type: 'number',
    }),
    ApiResponse({
      status: 201,
      description: 'Destaque criado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Dados inválidos ou já existe um destaque nesse trecho de texto.',
    }),
    ApiResponse({
      status: 403,
      description:
        'Usuário não tem permissão para adicionar destaque a esta correção.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou correção não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação do destaque',
      type: CreateCorrecaoHighlightsDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo de criação de destaque',
          value: {
            startIndex: 10,
            endIndex: 20,
            color: '#FF0000',
          },
        },
      },
    }),
  );
}
