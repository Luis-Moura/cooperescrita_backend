import { Controller, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { deleteRedacaoDocs } from '../docs/controllers/deleteRedacaoDocs.decorator';
import { DeleteRedacaoService } from '../services/deleteRedacao.service';

@ApiTags('redacao')
@Controller('redacao')
export class DeleteRedacaoController {
  constructor(private readonly deleteRedacaoService: DeleteRedacaoService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('delete-redacao/:id')
  @deleteRedacaoDocs()
  async deleteRedacaoById(@Request() req) {
    const userId = req.user.userId;
    const id = req.params.id;

    return await this.deleteRedacaoService.deleteRedacaoById(userId, id);
  }
}
