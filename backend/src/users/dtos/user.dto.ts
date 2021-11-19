import { Expose } from "class-transformer";

/**
 *  Describes how to serialize a user.
 */

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    username: string;
}