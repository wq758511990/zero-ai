import { IsNotEmpty, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(10)
  password: string;
}
