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
import { GetCorrecaoFeedbackService } from '../service/getCorrecaoFeedback.service';
import { GetCorrecaoFeedbackDocs } from '../docs/controller/GetCorrecaoFeedbackDocs.decorator';
import { GetCorrecaoFeedbackByIdDocs } from '../docs/controller/GetCorrecaoFeedbackByIdDocs.decorator';

@ApiTags('CorrecaoFeedbacks')
@Controller('correcao/feedbacks')
export class GetCorrecaoFeedbackController {
  constructor(
    private readonly getCorrecaoFeedbackService: GetCorrecaoFeedbackService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId')
  @GetCorrecaoFeedbackDocs()
  async getCorrecaoFeedback(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
  ) {
    const userId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    return this.getCorrecaoFeedbackService.getCorrecaoFeedback(
      userId,
      +correcaoId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':correcaoId/:feedbackId')
  @GetCorrecaoFeedbackByIdDocs()
  async getCorrecaoFeedbackById(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
    @Param('feedbackId') feedbackId: number,
  ) {
    const userId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    if (!feedbackId || isNaN(feedbackId)) {
      throw new BadRequestException('Invalid feedbackId');
    }

    return this.getCorrecaoFeedbackService.getCorrecaoFeedbackById(
      userId,
      +correcaoId,
      +feedbackId,
    );
  }
}
