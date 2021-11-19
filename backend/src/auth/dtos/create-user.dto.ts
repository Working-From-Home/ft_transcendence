import { IsEmail, IsString, IsNotEmpty } from "class-validator";

/**
 *  Defines how sign up inputs should be formated.
 */

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}