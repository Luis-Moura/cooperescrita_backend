import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCorrecaoDto {
  @IsNumber()
  @IsNotEmpty()
  correcaoId: number;
}
