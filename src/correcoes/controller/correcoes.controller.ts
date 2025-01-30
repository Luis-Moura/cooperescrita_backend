import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CorrecoesService } from '../service/correcoes.service';
import { CreateCorrecaoDto } from '../dto/createCorrecao.dto';

@ApiTags('correcao')
@Controller('correcao')
export class CorrecoesController {
  constructor(private readonly correcoesService: CorrecoesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('definitivo')
  async createDefinitiveCorrecao(
    @Request() req,
    @Body() createDefinitiveCorrecaoDto: CreateCorrecaoDto,
  ) {
    const corretorId = req.user.userId;
    return this.correcoesService.createDefinitiveCorrecao(
      corretorId,
      createDefinitiveCorrecaoDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('rascunho')
  async createDraftCorrecao(
    @Request() req,
    @Body() createDraftCorrecaoDto: CreateCorrecaoDto,
  ) {
    const corretorId = req.user.userId;
    return this.correcoesService.createDraftCorrecao(
      corretorId,
      createDraftCorrecaoDto,
    );
  }
}
