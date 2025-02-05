import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(10)
  password: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  captcha: string;

  nickname: string;
}
