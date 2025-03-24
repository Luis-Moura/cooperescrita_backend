import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FeedbackType } from '../interfaces/FeedbackType';

export class CreateCorrecaoFeedbackDto {
  @ApiProperty({
    description: 'Tipo de feedback para a correção',
    required: true,
    enum: FeedbackType,
    example: 'like',
  })
  @IsEnum(FeedbackType)
  @IsNotEmpty()
  feedbackType: FeedbackType;
}
