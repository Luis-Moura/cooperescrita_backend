import {
  Body,
  Controller,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDefinitiveRedacaoDocs } from '../docs/controllers/createDefinitiveRedacaoDocs.decorator';
import { CreateDraftDocs } from '../docs/controllers/createDraftDocs.decorator';
import { createDefinitiveRedacaoDto } from '../dto/createDefinitiveRedacaoDto';
import { createDraftRedacaoDto } from '../dto/createDraftRedacaoDto';
import { CreateRedacaoService } from '../services/createRedacao.service';

@ApiTags('redacao')
@Controller('redacao')
export class CreateRedacaoController {
  constructor(private readonly createRedacoesService: CreateRedacaoService) {}

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Post('create-redacao') // rota para criar redação
  @CreateDefinitiveRedacaoDocs() // gera a documentação da rota
  createDefinitiveRedacao(
    @Body() redacaoDTo: createDefinitiveRedacaoDto,
    @Request() req,
    @Query('redacaoId') redacaoId?: number,
  ) {
    const userId = req.user.userId;

    return this.createRedacoesService.createDefinitiveRedacao(
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

    return this.createRedacoesService.createDraft(userId, createDraft);
  }
}
