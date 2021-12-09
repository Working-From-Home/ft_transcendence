import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Avatar } from "./avatar.entity";
import { Friendship } from "./friendship.entity";
import { Stats } from "./stats.entity";

export enum UserRole {
    User = "user",
    Admin = "admin",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ default: 'user' })
    role: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToOne(type => Avatar, avatar => avatar.user)
    avatar: Avatar;

    @OneToOne(type => Stats, stats => stats.user)
    stats: Stats;

    @OneToMany(type => Friendship, friendRequest => friendRequest.applicant)
    sentFriendRequests: Friendship[];

    @OneToMany(type => Friendship, friendRequest => friendRequest.recipient)
    receivedFriendRequests: Friendship[];

}
