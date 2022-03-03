import { Expose, Transform, Type } from "class-transformer";
import { Stats } from "../entities/stats.entity";

export class UserDto {

    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    username: string;

    @Expose()
    role: string;

    @Expose()
    statistics: { level: number, victories: number, losses: number }
}