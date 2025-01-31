import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCorrecoesDto } from '../dto/getCorrecoes.dto';
import { GetCorrecoesService } from '../service/getRedacoes.service';

@ApiTags('correcao')
@Controller('get-correcoes')
export class GetCorrecoesController {
  constructor(private readonly getCorrecoesService: GetCorrecoesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCorrecoes(@Request() req, @Body() getCorrecoesDto: GetCorrecoesDto) {
    const corretorId: string = req.user.userId;
    return this.getCorrecoesService.getCorrecoes(corretorId, getCorrecoesDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCorrecaoById(@Request() req, @Param('id') id: number) {
    const corretorId: string = req.user.userId;
    return this.getCorrecoesService.getCorrecaoById(corretorId, id);
  }
}
