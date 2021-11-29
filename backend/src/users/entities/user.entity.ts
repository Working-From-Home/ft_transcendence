import {
    Entity, Column, PrimaryGeneratedColumn,
    OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Avatar } from "./avatar.entity";
import { FriendRequest } from "./friend-request.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @JoinColumn({ name: 'avatarId' })
    @OneToOne(() => Avatar, avatar => avatar.user, { onDelete: "CASCADE" })
    avatar: Avatar;
 
    @Column()
    avatarId: number;

    // @OneToMany(() => FriendRequest, friendRequest => friendRequest.sender)
    // sentfriendRequests: FriendRequest[];

    // @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
    // receivedfriendRequests: FriendRequest[];

}
