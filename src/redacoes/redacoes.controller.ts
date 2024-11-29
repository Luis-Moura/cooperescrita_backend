import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetRedacoesDecoratorsDocs } from './decorators/getRedacoesDocs.decorator';
import { createDefinitiveRedacaoDto } from './dto/createDefinitiveRedacaoDto';
import { RedacoesService } from './redacoes.service';

@ApiTags('redacoes')
@Controller('redacao')
export class RedacoesController {
  constructor(private readonly redacoesService: RedacoesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-redacao')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova redação' })
  @ApiResponse({ status: 201, description: 'Redação criada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  createDefinitiveRedacao(
    @Body() redacaoDTo: createDefinitiveRedacaoDto,
    @Request() req,
  ) {
    const userId = req.user.userId;

    return this.redacoesService.createDefinitiveRedacao(redacaoDTo, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-redacoes')
  @GetRedacoesDecoratorsDocs()
  getRedacoes(
    @Request() req,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('order') order?: 'crescente' | 'decrescente',
    @Query('statusEnvio') statusEnvio?: 'rascunho' | 'enviada',
    @Query('statusCorrecao') statusCorrecao?: 'corrigidas' | 'nao-corrigidas',
  ) {
    const userId = req.user.userId;
    const maxLimit = 50;

    limit = limit > maxLimit ? maxLimit : limit;

    return this.redacoesService.getRedacoes(userId, limit, offset, {
      order,
      statusEnvio,
      statusCorrecao,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-redacao/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar uma redação específica pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da redação' })
  @ApiResponse({ status: 200, description: 'Redação encontrada.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({
    status: 404,
    description: 'Usuário ou redação não encontrados.',
  })
  getRedacaoById(@Request() req) {
    const userId = req.user.userId;
    const id = req.params.id;

    return this.redacoesService.getRedacaoById(userId, id);
  }
}
