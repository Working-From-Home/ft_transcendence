import { IsEmail, IsString, IsOptional, Length, IsAlphanumeric } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    @Length(2, 30)
    @IsAlphanumeric()
    username: string;

    @IsString()
    @IsOptional()
    password: string;
}