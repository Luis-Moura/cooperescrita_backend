import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { createDefinitiveRedacaoDto } from 'src/redacoes/dto/createDefinitiveRedacaoDto';

export function CreateDefinitiveRedacaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary:
        'Criar uma nova redação ou atualiza uma redacao existente(caso não tenha sido enviada em definitivo)',
    }),
    ApiResponse({ status: 201, description: 'Redação criada com sucesso.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou rascunho não encontrados.',
    }),
    ApiResponse({
      status: 400,
      description: 'Redação já enviada em definitivo.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiQuery({
      name: 'redacaoId',
      required: false,
      description: 'ID de uma redação que esteja em estado de rascunho',
    }),
    ApiBody({
      description: 'Dados para criação ou atualização da redação',
      type: createDefinitiveRedacaoDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo de criação de redação',
          value: {
            title: 'Minha Redação',
            topic: 'Tema da Redação',
            content:
              'Este é o conteúdo da minha redação. (tamanho mínimo de 700 caracteres e máximo de 4000)',
          },
        },
      },
    }),
  );
}
