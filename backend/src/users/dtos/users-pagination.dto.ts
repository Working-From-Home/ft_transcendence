import { Expose, Type} from "class-transformer";
import { ValidateNested } from "class-validator";
import { User } from "../user.entity";
import { UserDto } from "./user.dto";

/**
 *  Describes how to serialize a user.
 */

export class UsersPaginationDto {

    @ValidateNested({ each: true })
    @Type(() => UserDto)
    @Expose()
    items: User[];

    @Expose()
    meta: JSON;

    @Expose()
    links: JSON;
}