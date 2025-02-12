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
import { GetCorrecaoSuggestionService } from '../service/getCorrecaosuggestion.service';

@ApiTags('CorrecaoSuggestion')
@Controller('correcao/suggestion')
export class GetCorrecaoSuggestionController {
  constructor(
    private readonly getCorrecaoSuggestionService: GetCorrecaoSuggestionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId')
  async getCorrecaoSuggestions(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
  ) {
    const corretorId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    return this.getCorrecaoSuggestionService.getCorrecaoSuggestion(
      corretorId,
      correcaoId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId/:suggestionId')
  async getCorrecaoSuggestionById(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
    @Param('suggestionId') suggestionId: number,
  ) {
    const corretorId = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    if (!suggestionId || isNaN(suggestionId)) {
      throw new BadRequestException('Invalid suggestionId');
    }

    return this.getCorrecaoSuggestionService.getCorrecaoSuggestionById(
      corretorId,
      correcaoId,
      suggestionId,
    );
  }
}
