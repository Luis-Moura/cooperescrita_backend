import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { GetRedacaoByIdDocs } from '../docs/controllers/getRedacaoByIdDocs.decorator';
import { GetRedacoesDecoratorsDocs } from '../docs/controllers/getRedacoesDocs.decorator';
import { IGetRedacoes } from '../interfaces/IGetRedacoes';
import { OrderQueryPrivateRedacoes } from '../interfaces/OrderQueryPrivateRedacoes';
import { OrderQueryPublicRedacoes } from '../interfaces/OrderQueryPublicRedacoes';
import { GetRedacaoService } from '../services/getRedacao.service';
import { Throttle } from '@nestjs/throttler';

@ApiTags('redacao')
@Controller('redacao')
export class GetRedacaoController {
  constructor(private readonly getRedacaoService: GetRedacaoService) {}

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // limita o número de requisições
  @Get('get-public-redacoes') // rota para buscar redações
  @GetRedacoesDecoratorsDocs() // gera a documentação da rota
  getRedacoes(
    @Request() req,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query() orderQuery: OrderQueryPublicRedacoes,
  ): Promise<IGetRedacoes> {
    const userId = req.user.userId;
    const maxLimit = 50;

    limit = limit > maxLimit ? maxLimit : limit;

    return this.getRedacaoService.getPublicRedacoes(
      userId,
      limit,
      offset,
      orderQuery,
    );
  }

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // limita o número de requisições
  @Get('get-private-redacoes') // rota para buscar redações
  @GetRedacoesDecoratorsDocs() // gera a documentação da rota
  getPrivateRedacoes(
    @Request() req,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query() orderQuery: OrderQueryPrivateRedacoes,
  ): Promise<IGetRedacoes> {
    const userId = req.user.userId;
    const maxLimit = 50;

    limit = limit > maxLimit ? maxLimit : limit;

    return this.getRedacaoService.getMyRedacoes(
      userId,
      limit,
      offset,
      orderQuery,
    );
  }

  @UseGuards(JwtAuthGuard) // protege a rota com JWT
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // limita o número de requisições
  @Get('get-redacao/:id') // rota para buscar redação por ID
  @GetRedacaoByIdDocs() // gera a documentação da rota
  getRedacaoById(@Request() req) {
    const userId = req.user.userId;
    const id = req.params.id;

    return this.getRedacaoService.getRedacaoById(userId, +id);
  }
}
