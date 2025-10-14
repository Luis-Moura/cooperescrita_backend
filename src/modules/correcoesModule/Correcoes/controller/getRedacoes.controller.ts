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
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { GetCorrecoesDto } from '../dto/getCorrecoes.dto';
import { GetCorrecoesService } from '../service/getCorrecoes.service';
import { GetPublicCorrecoesDocs } from '../docs/controllers/getPublicCorrecoes.decorator';
import { GetPrivateCorrecoesDocs } from '../docs/controllers/getPrivateCorrecoes.decorator';
import { GetCorrecaoByIdDocs } from '../docs/controllers/getCorrecaoById.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('correcao')
@Controller('get-correcoes')
export class GetCorrecoesController {
  constructor(private readonly getCorrecoesService: GetCorrecoesService) {}

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // limita o número de requisições
  @Get('public')
  @GetPublicCorrecoesDocs()
  async getPublicCorrecoes(
    @Request() req,
    @Query() getCorrecoesDto: GetCorrecoesDto,
  ) {
    const userId: string = req.user.userId;

    return this.getCorrecoesService.getPublicCorrecoes(
      userId,
      // redacaoId,
      getCorrecoesDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // limita o número de requisições
  @Get('private')
  @GetPrivateCorrecoesDocs()
  async getPrivateCorrecoes(
    @Request() req,
    @Query() getCorrecoesDto: GetCorrecoesDto,
  ) {
    const userId: string = req.user.userId;

    return this.getCorrecoesService.getMyCorrecoes(
      userId,
      // redacaoId,
      getCorrecoesDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // limita o número de requisições
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
