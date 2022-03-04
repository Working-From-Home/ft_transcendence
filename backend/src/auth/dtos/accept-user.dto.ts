import { IsString, IsNotEmpty, IsEmail } from "class-validator";

/**
 *  Defines how sign in inputs should be formated.
 */

export class AcceptUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}