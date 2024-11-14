import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRedacaoDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsNotEmpty()
  @IsString()
  @Length(700, 4000)
  content: string;
}
