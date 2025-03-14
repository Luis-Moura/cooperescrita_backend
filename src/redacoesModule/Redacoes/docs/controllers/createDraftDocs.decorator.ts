import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { createDraftRedacaoDto } from 'src/redacoesModule/Redacoes/dto/createDraftRedacaoDto';

export function CreateDraftDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Criar um rascunho de redação' }),
    ApiResponse({ status: 201, description: 'Rascunho criado com sucesso.' }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado.' }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação do rascunho da redação',
      type: createDraftRedacaoDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo de criação de rascunho',
          value: {
            title: 'Meu Rascunho',
            topic: 'Tema do Rascunho',
            content:
              'Este é o conteúdo do meu rascunho. (Máximo de 4000 caracteres)',
          },
        },
      },
    }),
  );
}
