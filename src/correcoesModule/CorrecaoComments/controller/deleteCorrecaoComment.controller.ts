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
import { DeleteCorrecaoCommentService } from '../service/deleteCorrecaoComment.service';
import { DeleteCorrecaoCommentDocs } from '../docs/controller/DeleteCorrecaoCommentDocs.decorator';

@ApiTags('CorrecaoComments')
@Controller('correcao/comments')
export class DeleteCorrecaoCommentController {
  constructor(
    private readonly deleteCorrecaoCommentService: DeleteCorrecaoCommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':correcaoId/:commentId')
  @DeleteCorrecaoCommentDocs()
  async deleteCorrecaoComment(
    @Request() req,
    @Param('correcaoId') correcaoId: number,
    @Param('commentId') commentId: number,
  ) {
    if (!correcaoId || isNaN(correcaoId)) {
      throw new BadRequestException('Invalid correcaoId');
    }

    if (!commentId || isNaN(commentId)) {
      throw new BadRequestException('Invalid commentId');
    }

    const corretorId = req.user.userId;

    return this.deleteCorrecaoCommentService.deleteCorrecaoComment(
      corretorId,
      correcaoId,
      commentId,
    );
  }
}
