import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateRedacaoCommentDto } from '../../dto/updateRedacaoComment.dto';

export function UpdateRedacaoCommentDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Atualizar um comentário em uma redação',
      description:
        'Atualiza o conteúdo ou a posição de um comentário existente em uma redação',
    }),
    ApiParam({
      name: 'redacaoId',
      type: 'number',
      description: 'ID da redação contendo o comentário',
      required: true,
      example: 1,
    }),
    ApiParam({
      name: 'commentId',
      type: 'number',
      description: 'ID do comentário a ser atualizado',
      required: true,
      example: 1,
    }),
    ApiBody({
      type: UpdateRedacaoCommentDto,
      description: 'Dados para atualização do comentário',
      examples: {
        example1: {
          summary: 'Atualização válida do comentário',
          value: {
            startIndex: 10,
            endIndex: 50,
            comentario:
              'Este é um comentário atualizado com um feedback aprimorado sobre a seção da redação.',
            color: '#00FF00',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Comentário atualizado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Requisição inválida - Erros de validação:\n' +
        '- ID da redação inválido\n' +
        '- ID do comentário inválido\n' +
        '- Índices inválidos (startIndex deve ser menor que endIndex)',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado - O usuário não é o autor do comentário',
    }),
    ApiResponse({
      status: 404,
      description:
        'Não encontrado:\n' +
        '- Usuário não encontrado\n' +
        '- Redação não encontrada\n' +
        '- Comentário não encontrado',
    }),
  );
}
