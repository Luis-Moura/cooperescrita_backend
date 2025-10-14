import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCorrecaoSuggestionDto } from '../../dto/createCorrecaosuggestion.dto';

export function CreateCorrecaoSuggestionDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar uma sugestão de correção para uma redação',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção onde a sugestão será adicionada',
      type: 'number',
    }),
    ApiResponse({
      status: 201,
      description: 'Sugestão de correção criada com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Dados inválidos ou já existe uma sugestão nesse trecho de texto.',
    }),
    ApiResponse({
      status: 403,
      description:
        'Usuário não tem permissão para adicionar sugestão a esta correção.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou correção não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação da sugestão de correção',
      type: CreateCorrecaoSuggestionDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo de criação de sugestão de correção',
          value: {
            startIndex: 10,
            endIndex: 20,
            originalText: 'texto com erro',
            suggestionText: 'texto corrigido',
          },
        },
      },
    }),
  );
}
