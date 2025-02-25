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
import { CreateRedacaoCommentsDto } from '../dto/createRedacaoComments.dto';
import { CreateRedacaoCommentService } from '../service/createRedacaoComment.service';
import { CreateRedacaoCommentsDocs } from '../docs/controllers/createRedacaoComments.decorator';

@ApiTags('RedacaoComments')
@Controller('redacao/comments')
export class CreateRedacaoCommentController {
  constructor(
    private readonly createRedacaoCommentService: CreateRedacaoCommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':redacaoId')
  @CreateRedacaoCommentsDocs()
  async createRedacaoComments(
    @Request() req,
    @Body() createRedacaoCommentsDto: CreateRedacaoCommentsDto,
    @Param('redacaoId') redacaoId: number,
  ) {
    const autorId: string = req.user.userId;

    if (!redacaoId || isNaN(redacaoId)) {
      throw new BadRequestException('Invalid redacaoId');
    }

    return this.createRedacaoCommentService.createRedacaoComments(
      autorId,
      createRedacaoCommentsDto,
      +redacaoId,
    );
  }
}
