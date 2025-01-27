import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CorrecoesService } from '../service/correcoes.service';

@Controller('correcoes')
export class CorrecoesController {
  constructor(private readonly correcoesService: CorrecoesService) {}

  @Post()
  create() {
    return this.correcoesService.create();
  }

  @Get()
  findAll() {
    return this.correcoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.correcoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.correcoesService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.correcoesService.remove(+id);
  }
}
