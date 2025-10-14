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
import { DeleteRedacaoCommentService } from '../service/deleteRedacaoComment.service';
import { DeleteRedacaoCommentDocs } from '../docs/controllers/deleteRedacaoComment.decorator';

@ApiTags('RedacaoComments')
@Controller('redacao/comments')
export class DeleteRedacaoCommentController {
  constructor(
    private readonly deleteRedacaoCommentService: DeleteRedacaoCommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':redacaoId/:commentId')
  @DeleteRedacaoCommentDocs()
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
