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
import { CreateCorrecaoSugestionDto } from '../dto/createCorrecaosugestion.dto';
import { CreateCorrecaoSugestionService } from '../service/createCorrecaoSugestion.service';

@ApiTags('CorrecaoSugestion')
@Controller('correcao-sugestion')
export class CreateCorrecaoSugestionController {
  constructor(
    private readonly createCorrecaoSugestionService: CreateCorrecaoSugestionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':correcaoId')
  async createCorrecaoSugestion(
    @Request() req,
    @Body() createCorrecaoSugestionDto: CreateCorrecaoSugestionDto,
    @Param('correcaoId') correcaoId: number,
  ) {
    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    const corretorId: string = req.user.userId;

    return this.createCorrecaoSugestionService.createCorrecaoSugestion(
      corretorId,
      createCorrecaoSugestionDto,
      correcaoId,
    );
  }
}
