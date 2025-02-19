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
import { DeleteRedacaoCommentService } from '../service/deleteRedacaoComment.service';

@ApiTags('RedacaoComments')
@Controller('redacao/comments')
export class DeleteRedacaoCommentController {
  constructor(
    private readonly deleteRedacaoCommentService: DeleteRedacaoCommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':redacaoId/:commentId')
  async deleteRedacaoComment(
    @Request() req,
    @Param('redacaoId') redacaoId: number,
    @Param('commentId') commentId: number,
  ) {
    const autorId: string = req.user.userId;

    if (!commentId || isNaN(commentId)) {
      throw new BadRequestException('Invalid commentId');
    }

    if (!redacaoId || isNaN(redacaoId)) {
      throw new BadRequestException('Invalid redacaoId');
    }

    return this.deleteRedacaoCommentService.deleteRedacaoComment(
      autorId,
      +redacaoId,
      +commentId,
    );
  }
}
