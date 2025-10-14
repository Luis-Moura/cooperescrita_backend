import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateCorrecaoCommentsDto } from '../dto/createCorrecaoComments.dto';
import { CreateCorrecaoCommentsService } from '../service/createCorrecaoComment.service';
import { CreateCorrecaoCommentsDocs } from '../docs/controller/CreateCorrecaoCommentsDocs.decorator';

@ApiTags('CorrecaoComments')
@Controller('correcao/comments')
export class CreateCorrecaoCommentsController {
  constructor(
    private readonly createCorrecaoCommentsService: CreateCorrecaoCommentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':correcaoId')
  @CreateCorrecaoCommentsDocs()
  async createCorrecaoComments(
    @Request() req,
    @Body() createCorrecaoCommentsDto: CreateCorrecaoCommentsDto,
    @Param('correcaoId') correcaoId: number,
  ) {
    const corretorId: string = req.user.userId;
    return this.createCorrecaoCommentsService.createCorrecaoComments(
      corretorId,
      createCorrecaoCommentsDto,
      correcaoId,
    );
  }
}
