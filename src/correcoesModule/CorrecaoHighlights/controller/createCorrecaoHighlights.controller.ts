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
import { CreateCorrecaoHighlightsDto } from '../dto/createCorrecaoHighlights.dto';
import { CreateCorrecaoHighlightsService } from '../service/createCorrecaoHighlights.service';

@ApiTags('CorrecaoHighlights')
@Controller('correcao/highlights')
export class CreateCorrecaoHighlightsController {
  constructor(
    private readonly createCorrecaoHighlightsService: CreateCorrecaoHighlightsService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post(':correcaoId')
  async createCorrecaoHighlights(
    @Request() req,
    @Body() createCorrecaoHighlightsDto: CreateCorrecaoHighlightsDto,
    @Param('correcaoId') correcaoId: number,
  ) {
    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    const corretorId: string = req.user.userId;

    return this.createCorrecaoHighlightsService.createCorrecaoHighlights(
      corretorId,
      createCorrecaoHighlightsDto,
      correcaoId,
    );
  }
}
