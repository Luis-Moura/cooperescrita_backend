import { Body, Controller, Post } from '@nestjs/common';
import { RedacaoDto } from './dto/redacao.dto';
import { RedacoesService } from './redacoes.service';

@Controller('redacoes')
export class RedacoesController {
  constructor(private readonly redacoesService: RedacoesService) {}

  @Post()
  create(@Body() redacaoDTo: RedacaoDto) {
    return this.redacoesService.create(redacaoDTo);
  }
}
