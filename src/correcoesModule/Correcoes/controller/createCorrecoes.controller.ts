import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCorrecaoDto } from '../dto/createCorrecao.dto';
import { CreateCorrecoesService } from '../service/createCorrecoes.service';
import { CreateDefinitiveCorrecaoDocs } from '../docs/controllers/createDefinitiveCorrecao.decorator';
import { CreateDraftCorrecaoDocs } from '../docs/controllers/createDraftCorrecao.decorator';

@ApiTags('correcao')
@Controller('create-correcao')
export class CreateCorrecoesController {
  constructor(
    private readonly createCorrecoesService: CreateCorrecoesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('definitivo')
  @CreateDefinitiveCorrecaoDocs()
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
  @CreateDraftCorrecaoDocs()
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
