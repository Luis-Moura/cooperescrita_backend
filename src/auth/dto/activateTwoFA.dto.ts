import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActivateTwoFADto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
