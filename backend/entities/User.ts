import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Avatar } from "./Avatar";
import { Blocked } from "./Blocked";
import { Channel } from "./Channel";
import { Friendship } from "./Friendship";
import { Game } from "./Game";
import { Message } from "./Message";
import { Achievement } from "./Achievement";
import { UserChannel } from "./UserChannel";
import { UserStat } from "./UserStat";

@Index("user_email_key", ["email"], { unique: true })
@Index("user_pkey", ["id"], { unique: true })
@Index("user_username_key", ["username"], { unique: true })
@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "email", unique: true })
  email: string;

  @Column("text", { name: "username", unique: true })
  username: string;

  @Column("text", { name: "password" })
  password: string;

  @Column("enum", {
    name: "role",
    enum: ["owner", "admin", "user"],
    default: () => "'user'",
  })
  role: "owner" | "admin" | "user";

  @Column("timestamp with time zone", { name: "end_ban", nullable: true })
  endBan: Date | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("boolean", { name: "two_fa_enabled", default: () => "false" })
  twoFaEnabled: boolean;

  @Column("text", { name: "two_fa_secret", nullable: true })
  twoFaSecret: string | null;

  @Column("text", { name: "oauth_token_ft", nullable: true })
  oauthTokenFt: string | null;

  @OneToOne(() => Avatar, (avatar) => avatar.user)
  avatar: Avatar;

  @OneToMany(() => Blocked, (blocked) => blocked.applicant)
  blockeds: Blocked[];

  @OneToMany(() => Blocked, (blocked) => blocked.recipient)
  blockeds2: Blocked[];

  @OneToMany(() => Channel, (channel) => channel.owner)
  channels: Channel[];

  @OneToMany(() => Friendship, (friendship) => friendship.applicant)
  friendships: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.recipient)
  friendships2: Friendship[];

  @OneToMany(() => Game, (game) => game.looser)
  games: Game[];

  @OneToMany(() => Game, (game) => game.winner)
  games2: Game[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ManyToMany(() => Achievement, (achievement) => achievement.users)
  achievements: Achievement[];

  @OneToMany(() => UserChannel, (userChannel) => userChannel.user)
  userChannels: UserChannel[];

  @OneToOne(() => UserStat, (userStat) => userStat.user)
  userStat: UserStat;
}
