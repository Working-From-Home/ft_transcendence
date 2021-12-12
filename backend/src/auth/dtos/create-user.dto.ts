import { IsEmail, IsString, IsNotEmpty, IsNumber } from "class-validator";
import { Avatar } from "../../users/entities/avatar.entity";

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