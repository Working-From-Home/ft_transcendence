import { Expose, Type} from "class-transformer";
import { ValidateNested } from "class-validator";
import { User } from "../entities/user.entity";
import { UserDto } from "./user.dto";

export class FriendshipDto {
    @ValidateNested()
    @Type(() => UserDto)
    @Expose()
    user: User; 

    // @ValidateNested()
    // @Type(() => UserDto)
    // @Expose()
    // recipient: User;
}