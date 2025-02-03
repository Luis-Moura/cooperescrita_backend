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
import { GetCorrecaoCommentsService } from '../service/getCorrecaoComment.service';

@ApiTags('CorrecaoComments')
@Controller('correcao/comments')
export class GetCorrecaoCommentsController {
  constructor(
    private readonly getCorrecaoCommentsService: GetCorrecaoCommentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId')
  async getCorrecaoComments(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
  ) {
    const corretorId = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    return this.getCorrecaoCommentsService.getCorrecaoComments(
      corretorId,
      correcaoId,
    );
  }
}
