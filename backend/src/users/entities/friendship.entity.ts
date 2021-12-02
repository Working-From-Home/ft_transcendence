import { Expose } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn,
    JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

// export enum FriendshipStatus {
//     Pending = "pending",
//     Accepted = "accepted",
//     Rejected = "rejected"
// }

@Entity()
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => User, user => user.sentFriendRequests)
    // applicant: User;

    // @ManyToOne(() => User, user => user.receivedFriendRequests)
    // recipient: User;

    // @Column({
    //     type: "enum",
    //     enum: FriendshipStatus,
    //     default: FriendshipStatus.Pending
    // })
    // status: FriendshipStatus;
}