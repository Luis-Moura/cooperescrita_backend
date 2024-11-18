import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class createDefinitiveRedacaoDto {
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
