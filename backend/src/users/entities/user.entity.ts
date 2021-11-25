import {
    Entity, Column, PrimaryGeneratedColumn,
    OneToOne, JoinColumn } from "typeorm";
import { Avatar } from "./avatar.entity";

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
 
    @Column({ nullable: true })
    avatarId: number;
}
