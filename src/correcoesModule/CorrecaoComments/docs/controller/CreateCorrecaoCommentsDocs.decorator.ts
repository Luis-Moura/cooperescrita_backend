import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCorrecaoCommentsDto } from '../../dto/createCorrecaoComments.dto';

export function CreateCorrecaoCommentsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar um comentário para uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção onde o comentário será adicionado',
      type: 'number',
    }),
    ApiResponse({
      status: 201,
      description: 'Comentário criado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Dados inválidos, limite de comentários atingido ou já existe um comentário nesse trecho.',
    }),
    ApiResponse({
      status: 403,
      description: 'Usuário não tem permissão para comentar nesta correção.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou correção não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação do comentário',
      type: CreateCorrecaoCommentsDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo de criação de comentário',
          value: {
            comment:
              'Este trecho precisa melhorar a argumentação e desenvolver melhor as ideias apresentadas. Sugiro incluir mais dados que embasem seu ponto de vista.',
            startIndex: 50,
            endIndex: 150,
          },
        },
      },
    }),
  );
}
