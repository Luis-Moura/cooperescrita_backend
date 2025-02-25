import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateRedacaoCommentsDto } from '../../dto/createRedacaoComments.dto';

export function CreateRedacaoCommentsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar um comentário em uma redação',
    }),
    ApiResponse({ status: 201, description: 'Comentário criado com sucesso.' }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou redação não encontrados.',
    }),
    ApiResponse({
      status: 403,
      description:
        'Você não pode comentar em uma redação que não foi enviada em definitivo.',
    }),
    ApiResponse({
      status: 403,
      description: 'Você não tem permissão para comentar nesta redação.',
    }),
    ApiResponse({
      status: 400,
      description:
        'O índice de início do comentário deve ser menor que o índice de fim.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação do comentário',
      type: CreateRedacaoCommentsDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo de criação de comentário',
          value: {
            startIndex: 0,
            endIndex: 10,
            content: 'Este é o conteúdo do meu comentário.',
          },
        },
      },
    }),
  );
}
