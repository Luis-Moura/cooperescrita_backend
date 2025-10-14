import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCorrecaoDto } from '../../dto/createCorrecao.dto';

export function CreateDraftCorrecaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar um rascunho de correção para uma redação',
    }),
    ApiResponse({
      status: 201,
      description: 'Rascunho de correção criado com sucesso.',
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou rascunho de correção já existente.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário ou redação não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação do rascunho de correção',
      type: CreateCorrecaoDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo completo de criação de rascunho de correção',
          value: {
            redacaoId: 1,
            correcaoId: 2, // Opcional, apenas se estiver atualizando um rascunho existente
            nota: 750, // Opcional, nota de 0 a 1000
            comentario_final:
              'Bom desenvolvimento do tema, mas precisa melhorar a conclusão.',
          },
        },
        exemplo2: {
          summary: 'Exemplo mínimo de criação de rascunho de correção',
          value: {
            redacaoId: 1,
          },
        },
      },
    }),
  );
}
