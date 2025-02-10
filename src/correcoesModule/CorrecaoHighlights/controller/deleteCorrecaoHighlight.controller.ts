import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeleteCorrecaoHighlightsService } from '../service/deleteCorrecaoHighlight.service';

@ApiTags('CorrecaoHighlights')
@Controller('correcao/highlights')
export class DeleteCorrecaoHighlightsController {
  constructor(
    private readonly deleteCorrecaoHighlightService: DeleteCorrecaoHighlightsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':correcaoId/:highlightId')
  async deleteCorrecaoHighlight(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
    @Param('highlightId') highlightId: number,
  ) {
    const corretorId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    if (!highlightId || isNaN(highlightId)) {
      throw new BadRequestException('Invalid highlightId');
    }

    return this.deleteCorrecaoHighlightService.DeleteCorrecaoHighlightsService(
      corretorId,
      correcaoId,
      highlightId,
    );
  }
}
