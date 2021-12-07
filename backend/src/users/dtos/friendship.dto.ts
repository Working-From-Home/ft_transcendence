import { Expose, Type} from "class-transformer";
import { ValidateNested } from "class-validator";
import { FriendshipStatus } from "../entities/friendship.entity";
import { User } from "../entities/user.entity";
import { UserDto } from "./user.dto";

export class FriendshipsDto {

    @Expose()
    id: number;

    @Expose()
    status: FriendshipStatus;

    @ValidateNested()
    @Type(() => UserDto)
    @Expose()
    applicant: User;

    @ValidateNested()
    @Type(() => UserDto)
    @Expose()
    recipient: User;
}