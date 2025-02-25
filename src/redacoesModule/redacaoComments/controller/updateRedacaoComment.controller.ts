import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRedacaoCommentDto } from '../dto/updateRedacaoComment.dto';
import { UpdateRedacaoCommentService } from '../service/updateRedacaoComment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateRedacaoCommentDocs } from '../docs/controllers/updateRedacaoComment.decorator';

@ApiTags('RedacaoComments')
@Controller('redacao-comments')
export class UpdateRedacaoCommentController {
  constructor(
    private readonly updateRedacaoCommentService: UpdateRedacaoCommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':redacaoId/:commentId')
  @UpdateRedacaoCommentDocs()
  async updateRedacaoComment(
    @Request() req,
    @Param('redacaoId') redacaoId: number,
    @Param('commentId') commentId: number,
    @Body() updateRedacaoCommentdto: UpdateRedacaoCommentDto,
  ) {
    const autorId: string = req.user.userId;

    if (!commentId || isNaN(commentId)) {
      throw new BadRequestException('Invalid commentId');
    }

    if (!redacaoId || isNaN(redacaoId)) {
      throw new BadRequestException('Invalid redacaoId');
    }

    return this.updateRedacaoCommentService.updateRedacaoComment(
      autorId,
      +redacaoId,
      +commentId,
      updateRedacaoCommentdto,
    );
  }
}
