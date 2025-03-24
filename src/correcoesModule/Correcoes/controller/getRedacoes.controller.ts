import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCorrecoesDto } from '../dto/getCorrecoes.dto';
import { GetCorrecoesService } from '../service/getCorrecoes.service';
import { GetPublicCorrecoesDocs } from '../docs/controllers/getPublicCorrecoes.decorator';
import { GetPrivateCorrecoesDocs } from '../docs/controllers/getPrivateCorrecoes.decorator';
import { GetCorrecaoByIdDocs } from '../docs/controllers/getCorrecaoById.decorator';

@ApiTags('correcao')
@Controller('get-correcoes')
export class GetCorrecoesController {
  constructor(private readonly getCorrecoesService: GetCorrecoesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('public/:redacaoId')
  @GetPublicCorrecoesDocs()
  async getPublicCorrecoes(
    @Request() req,
    @Param('redacaoId') redacaoId: number,
    @Query() getCorrecoesDto: GetCorrecoesDto,
  ) {
    const userId: string = req.user.userId;

    if (!redacaoId || isNaN(redacaoId)) {
      throw new BadRequestException('Invalid redacaoId');
    }

    return this.getCorrecoesService.getPublicCorrecoes(
      userId,
      // redacaoId,
      getCorrecoesDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('private/:redacaoId')
  @GetPrivateCorrecoesDocs()
  async getPrivateCorrecoes(
    @Request() req,
    @Param('redacaoId') redacaoId: number,
    @Query() getCorrecoesDto: GetCorrecoesDto,
  ) {
    const userId: string = req.user.userId;

    if (!redacaoId || isNaN(redacaoId)) {
      throw new BadRequestException('Invalid redacaoId');
    }

    return this.getCorrecoesService.getMyCorrecoes(
      userId,
      // redacaoId,
      getCorrecoesDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId')
  @GetCorrecaoByIdDocs()
  async getCorrecaoById(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
  ) {
    const userId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    return this.getCorrecoesService.getCorrecaoById(userId, correcaoId);
  }
}
