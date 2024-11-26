import {
  Body,
  Controller,
  Get,
  Post,
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todas as redações do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Redações encontradas.' })
  @ApiResponse({
    status: 404,
    description: 'Usuário ou redações não encontradas.',
  })
  getRedacoes(@Request() req) {
    const userId = req.user.userId;

    return this.redacoesService.getRedacoes(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-redacao-id/:id')
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

  @UseGuards(JwtAuthGuard)
  @Get('get-redacao-status/:status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar redações pelo status' })
  @ApiParam({
    name: 'status',
    description: 'Status da redação (rascunho ou enviado)',
  })
  @ApiResponse({ status: 200, description: 'Redações encontradas.' })
  @ApiResponse({ status: 400, description: 'Status inválido.' })
  @ApiResponse({
    status: 404,
    description: 'Usuário ou redações não encontradas.',
  })
  getRedacaoByStatus(@Request() req) {
    const userId: string = req.user.userId;
    const status: 'rascunho' | 'enviado' = req.params.status;

    return this.redacoesService.getRedacaoByStatus(userId, status);
  }
}
