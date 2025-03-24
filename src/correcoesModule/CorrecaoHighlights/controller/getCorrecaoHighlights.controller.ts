import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCorrecaoHighlightsService } from '../service/getCorrecaoHighlights.service';
import { GetCorrecaoHighlightsDocs } from '../docs/controller/GetCorrecaoHighlightsDocs.decorator';
import { GetCorrecaoHighlightByIdDocs } from '../docs/controller/GetCorrecaoHighlightByIdDocs.decorator';

@ApiTags('CorrecaoHighlights')
@Controller('correcao/highlights')
export class GetCorrecaoHighlightsController {
  constructor(
    private readonly getCorrecaoHighlightsService: GetCorrecaoHighlightsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId')
  @GetCorrecaoHighlightsDocs()
  async getCorrecaoHighlights(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
  ) {
    const corretorId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    return this.getCorrecaoHighlightsService.getCorrecaoHighlights(
      corretorId,
      correcaoId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId/:highlightId')
  @GetCorrecaoHighlightByIdDocs()
  async getCorrecaoHighlightById(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
    @Param('highlightId') highlightId: number,
  ) {
    const corretorId = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    if (!highlightId || isNaN(highlightId)) {
      throw new BadRequestException('Invalid highlightId');
    }

    return this.getCorrecaoHighlightsService.getCorrecaoHighlightById(
      corretorId,
      correcaoId,
      highlightId,
    );
  }
}
