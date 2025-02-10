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

@ApiTags('CorrecaoHighlights')
@Controller('correcao/highlights')
export class GetCorrecaoHighlightsController {
  constructor(
    private readonly getCorrecaoHighlightsService: GetCorrecaoHighlightsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId')
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
}
