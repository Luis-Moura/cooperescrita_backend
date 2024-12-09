import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetRedacaoByIdDocs } from '../docs/controllers/getRedacaoByIdDocs.decorator';
import { GetRedacoesDecoratorsDocs } from '../docs/controllers/getRedacoesDocs.decorator';
import { IOrderQuery } from '../interfaces/IOrderQuery';
import { GetRedacaoService } from '../services/getRedacao.service';

@ApiTags('redacao')
@Controller('redacao')
export class GetRedacaoController {
  constructor(private readonly getRedacaoService: GetRedacaoService) {}

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

    return this.getRedacaoService.getRedacoes(
      userId,
      limit,
      offset,
      orderQuery,
    );
  }

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Get('get-redacao/:id') // rota para buscar redação por ID
  @GetRedacaoByIdDocs() // gera a documentação da rota
  getRedacaoById(@Request() req) {
    const userId = req.user.userId;
    const id = req.params.id;

    return this.getRedacaoService.getRedacaoById(userId, id);
  }
}
