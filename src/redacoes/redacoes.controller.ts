import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDefinitiveRedacaoDocs } from './docs/controllers/createDefinitiveRedacaoDocs.decorator';
import { CreateDraftDocs } from './docs/controllers/createDraftDocs.decorator';
import { GetRedacaoByIdDocs } from './docs/controllers/getRedacaoByIdDocs.decorator';
import { GetRedacoesDecoratorsDocs } from './docs/controllers/getRedacoesDocs.decorator';
import { createDefinitiveRedacaoDto } from './dto/createDefinitiveRedacaoDto';
import { createDraftRedacaoDto } from './dto/createDraftRedacaoDto';
import { IOrderQuery } from './interfaces/IOrderQuery';
import { RedacoesService } from './redacoes.service';

@ApiTags('redacoes')
@Controller('redacao')
export class RedacoesController {
  constructor(private readonly redacoesService: RedacoesService) {}

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Post('create-redacao') // rota para criar redação
  @CreateDefinitiveRedacaoDocs() // gera a documentação da rota
  createDefinitiveRedacao(
    @Body() redacaoDTo: createDefinitiveRedacaoDto,
    @Request() req,
    @Query('redacaoId') redacaoId?: number,
  ) {
    const userId = req.user.userId;

    return this.redacoesService.createDefinitiveRedacao(
      redacaoDTo,
      userId,
      redacaoId,
    );
  }

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Post('create-draft') // rota para criar rascunho de redação
  @CreateDraftDocs() // gera a documentação da rota
  createDraft(@Request() req, @Body() createDraft: createDraftRedacaoDto) {
    const userId = req.user.userId;

    return this.redacoesService.createDraft(userId, createDraft);
  }

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Get('get-redacoes') // rota para buscar redações
  @GetRedacoesDecoratorsDocs() // gera a documentação da rota
  getRedacoes(
    @Request() req,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query() orderQuery: IOrderQuery,
  ) {
    const userId = req.user.userId;
    const maxLimit = 50;

    limit = limit > maxLimit ? maxLimit : limit;

    return this.redacoesService.getRedacoes(userId, limit, offset, orderQuery);
  }

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Get('get-redacao/:id') // rota para buscar redação por ID
  @GetRedacaoByIdDocs() // gera a documentação da rota
  getRedacaoById(@Request() req) {
    const userId = req.user.userId;
    const id = req.params.id;

    return this.redacoesService.getRedacaoById(userId, id);
  }
}
