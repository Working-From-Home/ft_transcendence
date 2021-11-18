import { IsString } from "class-validator";

export class SignUserInDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}