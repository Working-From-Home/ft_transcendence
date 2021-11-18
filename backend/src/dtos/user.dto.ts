import { Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    username: string;

    @Expose()
    access_token: string;
}