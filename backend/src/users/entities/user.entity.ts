import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Avatar } from "./avatar.entity";
import { Friendship } from "./friendship.entity";
import { Stats } from "./stats.entity";
import { Channel } from "../../channels/entities/channel.entity";
import { Message } from "../../channels/entities/message.entity";
import { UserChannel } from "../../channels/entities/user-channel.entity";
import { Achievement } from "./achievement.entity";
import { Blocked } from "./blocked.entity";
import { Game } from "../../game/entities/game.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    /* Auth */

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: "enum", enum: ["owner", "admin", "user"], default: "user" })
    role: "owner" | "admin" | "user";

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "boolean", default: false })
    banned: boolean;

    /* OAuth */

    @Column({ type: "boolean", default: false })
    twoFaEnabled: boolean;

    @Column({ type: "text", nullable: true })
    twoFaSecret: string | null;

    @Column({ type: "text", nullable: true })
    oauthToken: string | null;

    /* Avatar */

    @OneToOne(() => Avatar, (avatar) => avatar.user)
    avatar: Avatar;

    /* Stats */

    @OneToOne(() => Stats, (stats) => stats.user)
    stats: Stats;

    /* Achievements */

    @ManyToMany(() => Achievement, (achievement) => achievement.users)
    @JoinTable({
        name: "user_achievements",
        joinColumns: [{ name: "userId", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "achievementId", referencedColumnName: "id" }]
    })
    achievements: Achievement[];

    /* Friendships */

    @OneToMany(() => Friendship, (friendRequest) => friendRequest.applicant)
    sentFriendRequests: Friendship[];

    @OneToMany(() => Friendship, (friendRequest) => friendRequest.recipient)
    receivedFriendRequests: Friendship[];

    /* Blocked */

    @OneToMany(() => Blocked, (blocked) => blocked.applicant)
    usersBlocked: Blocked[];

    @OneToMany(() => Blocked, (blocked) => blocked.recipient)
    BlockedBy: Blocked[];

    /* Channels */

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    @OneToMany(() => UserChannel, (userChannel) => userChannel.user)
    userChannels: UserChannel[];

    @OneToMany(() => Channel, (channel) => channel.owner)
    channels: Channel[];

    /* Game */

    @OneToMany(() => Game, (game) => game.looser)
    lossedGames: Game[];

    @OneToMany(() => Game, (game) => game.winner)
    wonGames: Game[];
}
