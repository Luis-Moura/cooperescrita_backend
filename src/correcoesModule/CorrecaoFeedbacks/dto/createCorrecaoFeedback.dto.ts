import { IsEnum, IsNotEmpty } from 'class-validator';
import { FeedbackType } from '../interfaces/FeedbackType';

export class CreateCorrecaoFeedbackDto {
  @IsEnum(FeedbackType)
  @IsNotEmpty()
  feedbackType: FeedbackType;
}
