import {
  Controller,
  UseGuards,
  Delete,
  Param,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeleteCorrecaoSuggestionsService } from '../service/deleteCorrecaoSuggestion.service';

@ApiTags('CorrecaoSuggestion')
@Controller('correcao/suggestion')
export class DeleteCorrecaoSuggestionController {
  constructor(
    private readonly deleteCorrecaoSuggestionService: DeleteCorrecaoSuggestionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':correcaoId/:suggestionId')
  async deleteCorrecaoSuggestion(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
    @Param('suggestionId') suggestionId: number,
  ) {
    const corretorId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    if (!suggestionId || isNaN(suggestionId)) {
      throw new BadRequestException('Invalid suggestionId');
    }

    return this.deleteCorrecaoSuggestionService.deleteCorrecaoSuggestions(
      corretorId,
      correcaoId,
      suggestionId,
    );
  }
}
