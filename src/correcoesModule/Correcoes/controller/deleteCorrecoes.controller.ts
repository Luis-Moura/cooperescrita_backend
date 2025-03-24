import { Controller, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeleteCorrecoesService } from '../service/deleteCorrecoes.service';
import { DeleteCorrecaoDocs } from '../docs/controllers/deleteCorrecao.decorator';

@ApiTags('correcao')
@Controller('delete-correcao')
export class DeleteCorrecoesController {
  constructor(
    private readonly deleteCorrecoesService: DeleteCorrecoesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':correcaoId')
  @DeleteCorrecaoDocs()
  async deleteCorrecaoById(
    @Param('correcaoId') correcaoId: number,
    @Request() req,
  ) {
    const corretor = req.user.userId;

    return this.deleteCorrecoesService.deleteCorrecaoById(corretor, correcaoId);
  }
}
