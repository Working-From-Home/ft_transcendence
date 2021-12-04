import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

export enum FriendshipStatus {
    Accepted = "accepted",
    Rejected = "rejected"
}

@Entity()
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.sentFriendRequests, { onDelete: "CASCADE" })
    applicant: User;

    @ManyToOne(() => User, user => user.receivedFriendRequests, { onDelete: "CASCADE" })
    recipient: User;

    @Column()
    status: string;
}