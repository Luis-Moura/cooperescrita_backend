import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { CreateRedacaoDto } from './dto/create-redacao.dto';
import { RedacoesService } from './redacoes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('redacao')
export class RedacoesController {
  constructor(private readonly redacoesService: RedacoesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-redacao')
  create(@Body() redacaoDTo: CreateRedacaoDto, @Request() req) {
    const userId = req.user.userId;

    return this.redacoesService.create(redacaoDTo, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-redacoes')
  getRedacoes(@Request() req) {
    const userId = req.user.userId;

    return this.redacoesService.getRedacoes(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-redacao-id/:id')
  getRedacaoById(@Request() req) {
    const userId = req.user.userId;
    const id = req.params.id;

    return this.redacoesService.getRedacaoById(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-redacao-status/:status')
  getRedacaoByStatus(@Request() req) {
    const userId: string = req.user.userId;
    const status: 'rascunho' | 'enviado' = req.params.status;

    return this.redacoesService.getRedacaoByStatus(userId, status);
  }
}
