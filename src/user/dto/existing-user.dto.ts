import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ExistingUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 32)
    password: string;
}