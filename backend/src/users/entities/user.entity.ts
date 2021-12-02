import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";
import { Avatar } from "./avatar.entity";
import { Friendship } from "./friendship.entity";
import { Stats } from "./stats.entity";

// export enum UserRole {
//     User = "user",
//     Admin = "admin",
// }

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ unique: true })
    username: string;

    // @Column({
    //     type: "enum",
    //     enum: UserRole,
    //     default: UserRole.User
    // })
    // role: UserRole;

    @Column()
    password: string;

    @OneToOne(() => Avatar, (avatar) => avatar.user, { eager: true })
    avatar: Avatar;

    @OneToOne(() => Stats, (stats) => stats.user, { eager: true })//, cascade: ['insert', 'update'] })
    stats: Stats;


    // @OneToOne(() => Stats, stats => stats.user, { cascade: ['insert'] })
    // @JoinColumn({ name: 'statsId' })
    // stats: Stats;



    // @OneToMany(() => Friendship, friendRequest => friendRequest.applicant)
    // sentFriendRequests: Friendship[];

    // @OneToMany(() => Friendship, friendRequest => friendRequest.recipient)
    // receivedFriendRequests: Friendship[];

}
