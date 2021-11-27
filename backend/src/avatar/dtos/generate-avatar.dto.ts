import { IsMimeType, IsString } from "class-validator";

/**
 *  Describes how generated avatar object should be.
 */

export class GenerateAvatarDto {
    @IsString()
    filename: string;

    data: Buffer;

    @IsMimeType()
    @IsString()
    mimetype: string;
}