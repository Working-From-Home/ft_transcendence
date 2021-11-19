import { IsString, IsNotEmpty } from "class-validator";

/**
 *  Defines how sign in inputs should be formated.
 */

export class AcceptUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}