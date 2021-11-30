import {
    Entity, Column, PrimaryGeneratedColumn,
    OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => User, user => user.sentfriendRequests)
    // applicant: User;

    // @ManyToOne(() => User, user => user.receivedfriendRequests)
    // recipient: User;

    @Column()
    status: string;
}