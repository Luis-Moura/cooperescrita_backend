import { IsNotEmpty, IsString } from 'class-validator';

export class FindByNameDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
