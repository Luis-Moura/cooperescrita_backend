import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCorrecaoFeedbackDto } from '../../dto/createCorrecaoFeedback.dto';

export function CreateCorrecaoFeedbackDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar um feedback para uma correção',
    }),
    ApiParam({
      name: 'correcaoId',
      required: true,
      description: 'ID da correção para adicionar feedback',
      type: 'number',
    }),
    ApiResponse({
      status: 201,
      description: 'Feedback criado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou ID de correção inválido.',
    }),
    ApiResponse({
      status: 403,
      description:
        'Usuário não tem permissão ou já deu feedback para esta correção.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou correção não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação do feedback',
      type: CreateCorrecaoFeedbackDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo de criação de feedback positivo',
          value: {
            feedbackType: 'like',
          },
        },
        exemplo2: {
          summary: 'Exemplo de criação de feedback negativo',
          value: {
            feedbackType: 'dislike',
          },
        },
      },
    }),
  );
}
