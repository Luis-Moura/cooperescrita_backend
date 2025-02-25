import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateRedacaoCommentsDto } from '../../dto/createRedacaoComments.dto';

export function CreateRedacaoCommentsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar um comentário em uma redação',
      description:
        'Cria um novo comentário em uma seção específica de uma redação, feita pelo próprio redator.',
    }),
    ApiParam({
      name: 'redacaoId',
      type: 'number',
      description: 'ID da redação a ser comentada',
      required: true,
      example: 1,
    }),
    ApiBody({
      type: CreateRedacaoCommentsDto,
      description: 'Dados do comentário',
      examples: {
        example1: {
          summary: 'Criação de comentário válida',
          value: {
            startIndex: 0,
            endIndex: 100,
            comentario:
              'Esta seção da redação eu fiquei inseguro no desenvolvimento do argumento e na coerência.',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Comentário criado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Requisição inválida - Erros de validação:\n' +
        '- ID da redação inválido\n' +
        '- O startIndex deve ser menor ou igual ao endIndex\n' +
        '- Já existe um comentário neste trecho\n' +
        '- Número máximo de comentários atingido (15)',
    }),
    ApiResponse({
      status: 403,
      description:
        'Proibido - Acesso negado:\n' +
        '- Você não pode comentar em uma redação em rascunho\n' +
        '- Você não tem permissão para comentar nesta redação',
    }),
    ApiResponse({
      status: 404,
      description:
        'Não encontrado:\n' +
        '- Usuário não encontrado\n' +
        '- Redação não encontrada',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor ao criar o comentário',
    }),
  );
}
