import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { deleteRedacaoDocs } from '../docs/controllers/deleteRedacaoDocs.decorator';

@ApiTags('redacao')
@Controller('redacao')
export class DeleteRedacaoController {
  constructor(private readonly deleteRedacaoService: DeleteRedacaoService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('redacoes/:id')
  @deleteRedacaoDocs()
  async delete(@Param('id') id: string) {
    return await this.deleteRedacaoService.delete(id);
  }
}
