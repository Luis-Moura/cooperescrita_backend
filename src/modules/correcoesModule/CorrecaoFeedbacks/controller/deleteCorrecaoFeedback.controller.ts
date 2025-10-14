import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DeleteCorrecaoFeedbackService } from '../service/deleteCorrecaoFeedback.service';
import { DeleteCorrecaoFeedbackDocs } from '../docs/controller/DeleteCorrecaoFeedbackDocs.decorator';

@ApiTags('CorrecaoFeedbacks')
@Controller('correcao/feedbacks')
export class DeleteCorrecaoFeedbackController {
  constructor(
    private readonly deleteCorrecaoFeedbackService: DeleteCorrecaoFeedbackService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':correcaoId/:feedbackId')
  @DeleteCorrecaoFeedbackDocs()
  async deleteCorrecaoFeedback(
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

    return this.deleteCorrecaoFeedbackService.deleteCorrecaoFeedback(
      userId,
      +correcaoId,
      +feedbackId,
    );
  }
}
