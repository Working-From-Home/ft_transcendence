import { IsEnum } from "class-validator";
import { FriendshipStatus } from "../entities/friendship.entity";

export class UpdateFriendshipDto {
   @IsEnum(FriendshipStatus)
   status: string;
}