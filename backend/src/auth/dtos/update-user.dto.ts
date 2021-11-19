import { IsEmail, IsString, IsOptional, IsNotEmpty } from "class-validator";

/**
 *  Defines how update inputs should be formated.
 */

export class UpdateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    username: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    password: string;
}