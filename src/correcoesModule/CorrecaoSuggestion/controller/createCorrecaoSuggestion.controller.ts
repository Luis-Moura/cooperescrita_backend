import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCorrecaoSuggestionDto } from '../dto/createCorrecaosuggestion.dto';
import { CreateCorrecaoSuggestionService } from '../service/createCorrecaoSuggestion.service';

@ApiTags('CorrecaoSuggestion')
@Controller('correcao-suggestion')
export class CreateCorrecaoSuggestionController {
  constructor(
    private readonly createCorrecaoSuggestionService: CreateCorrecaoSuggestionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':correcaoId')
  async createCorrecaoSuggestion(
    @Request() req,
    @Body() createCorrecaoSuggestionDto: CreateCorrecaoSuggestionDto,
    @Param('correcaoId') correcaoId: number,
  ) {
    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    const corretorId: string = req.user.userId;

    return this.createCorrecaoSuggestionService.createCorrecaoSuggestion(
      corretorId,
      createCorrecaoSuggestionDto,
      correcaoId,
    );
  }
}
