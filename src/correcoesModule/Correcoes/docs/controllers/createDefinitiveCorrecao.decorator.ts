import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCorrecaoDto } from '../../dto/createCorrecao.dto';

export function CreateDefinitiveCorrecaoDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar uma correção definitiva para uma redação',
    }),
    ApiResponse({ status: 201, description: 'Correção criada com sucesso.' }),
    ApiResponse({
      status: 400,
      description:
        'Dados inválidos, correção já existente ou redação já possui 15 correções.',
    }),
    ApiResponse({
      status: 404,
      description: 'Usuário, redação ou correção rascunho não encontrados.',
    }),
    ApiResponse({ status: 500, description: 'Erro interno do servidor.' }),
    ApiBody({
      description: 'Dados para criação da correção definitiva',
      type: CreateCorrecaoDto,
      examples: {
        exemplo1: {
          summary: 'Exemplo completo de criação de correção definitiva',
          value: {
            redacaoId: 1,
            correcaoId: 2, // Opcional, apenas se estiver atualizando um rascunho existente
            nota: 850, // Opcional, nota de 0 a 1000
            comentario_final:
              'Excelente texto, demonstra domínio do tema e boa argumentação. Continue praticando a estrutura dissertativa.',
          },
        },
        exemplo2: {
          summary: 'Exemplo mínimo de criação de correção definitiva',
          value: {
            redacaoId: 1,
          },
        },
      },
    }),
  );
}
