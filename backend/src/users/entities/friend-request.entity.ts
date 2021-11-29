import {
    Entity, Column, PrimaryGeneratedColumn,
    OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => User, user => user.sentfriendRequests)
    // sender: User;

    // @ManyToOne(() => User, user => user.receivedfriendRequests)
    // receiver: User;

    @Column()
    status: string;
}