import { IsEmail, IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from "class-validator";
import { User } from "../../users/entities/user.entity";

export class CreateChannelDto {
    @IsOptional()
    @IsString()
    title: string;
    
    @IsOptional()
    @IsString()
    password: string | null;
}