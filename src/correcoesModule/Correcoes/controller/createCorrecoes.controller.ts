import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCorrecaoDto } from '../dto/createCorrecao.dto';
import { CreateCorrecoesService } from '../service/createCorrecoes.service';

@ApiTags('correcao')
@Controller('correcao')
export class CreateCorrecoesController {
  constructor(
    private readonly createCorrecoesService: CreateCorrecoesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('definitivo')
  async createDefinitiveCorrecao(
    @Request() req,
    @Body() createDefinitiveCorrecaoDto: CreateCorrecaoDto,
  ) {
    const corretorId = req.user.userId;
    return this.createCorrecoesService.createDefinitiveCorrecao(
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
    return this.createCorrecoesService.createDraftCorrecao(
      corretorId,
      createDraftCorrecaoDto,
    );
  }
}
