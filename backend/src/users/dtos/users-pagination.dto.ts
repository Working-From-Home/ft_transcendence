import { Expose, Type} from "class-transformer";
import { ValidateNested } from "class-validator";
import { User } from "../entities/user.entity";
import { UserDto } from "./user.dto";

class lightUserDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    role: string;
}

export class UsersPaginationDto {

    @ValidateNested({ each: true })
    @Type(() =>lightUserDto)
    @Expose()
    items: User[];

    @Expose()
    meta: JSON;

    @Expose()
    links: JSON;
}