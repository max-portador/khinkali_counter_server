import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export default class AuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 32)
  password: string;
}
