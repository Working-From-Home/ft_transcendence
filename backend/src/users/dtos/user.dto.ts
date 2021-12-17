import { Expose } from "class-transformer";
import { Stats } from "../entities/stats.entity";
// import { UserRole } from "../entities/user.entity";

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    username: string;

    // @Expose()
    // role: UserRole;

    // @Expose()
    // stats: Stats;
}