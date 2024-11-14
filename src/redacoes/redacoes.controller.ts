import { Body, Controller, Post } from '@nestjs/common';
import { CreateRedacaoDto } from './dto/create-redacao.dto';
import { RedacoesService } from './redacoes.service';

@Controller('redacoes')
export class RedacoesController {
  constructor(private readonly redacoesService: RedacoesService) {}

  @Post()
  create(@Body() redacaoDTo: CreateRedacaoDto) {
    return this.redacoesService.create(redacaoDTo);
  }
}
