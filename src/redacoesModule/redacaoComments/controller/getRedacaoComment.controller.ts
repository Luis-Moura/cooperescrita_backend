import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetRedacaoCommentService } from '../service/getRedacaoComment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetRedacaoCommentsDocs } from '../docs/controllers/getRedacaoComments.decorator';

@ApiTags('RedacaoComments')
@Controller('redacao/comments')
export class GetRedacaoCommentsController {
  constructor(
    private readonly getRedacaoCommentService: GetRedacaoCommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':redacaoId')
  @GetRedacaoCommentsDocs()
  async getRedacaoComments(
    @Request() req,
    @Param('redacaoId') redacaoId: number,
  ) {
    const autorId: string = req.user.userId;

    if (!redacaoId || isNaN(redacaoId)) {
      throw new BadRequestException('Invalid redacaoId');
    }

    return this.getRedacaoCommentService.getRedacaoComments(
      autorId,
      +redacaoId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':redacaoId/:commentId')
  @GetRedacaoCommentsDocs()
  async getRedacaoCommentById(
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

    return this.getRedacaoCommentService.getRedacaoCommentById(
      autorId,
      +redacaoId,
      +commentId,
    );
  }
}
