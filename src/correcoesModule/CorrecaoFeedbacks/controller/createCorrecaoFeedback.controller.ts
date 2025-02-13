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
import { CreateCorrecaoFeedbackDto } from '../dto/createCorrecaoFeedback.dto';
import { CreateCorrecaoFeedbackService } from '../service/createCorrecaoFeedback.service';

@ApiTags('CorrecaoFeedbacks')
@Controller('correcao/feedbacks')
export class CreateCorrecaoFeedbackController {
  constructor(
    private readonly createCorrecaoFeedbackService: CreateCorrecaoFeedbackService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':correcaoId')
  async createCorrecaoFeedback(
    @Request() req,
    @Body() createCorrecaoFeedbackDto: CreateCorrecaoFeedbackDto,
    @Param('correcaoId') correcaoId: number,
  ) {
    const userId: string = req.user.userId;

    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId!');
    }

    return this.createCorrecaoFeedbackService.createCorrecaoFeedback(
      userId,
      createCorrecaoFeedbackDto,
      +correcaoId,
    );
  }
}
