import { Expose, Type} from "class-transformer";
import { ValidateNested } from "class-validator";
import { FriendshipStatus } from "../entities/friendship.entity";
import { UserDto } from "./user.dto";

export class FriendshipsPaginationDto {

    @Expose()
    id: number;

    @Expose()
    status: FriendshipStatus;

    @Expose()
    applicant: UserDto;

    @Expose()
    recipient: UserDto;
}