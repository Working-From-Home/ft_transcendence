import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Message } from "./Message";
import { UserChannel } from "./UserChannel";

@Index("channel_pkey", ["id"], { unique: true })
@Entity("channel", { schema: "public" })
export class Channel {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("boolean", { name: "is_dm" })
  isDm: boolean;

  @Column("text", { name: "title", nullable: true })
  title: string | null;

  @Column("text", { name: "password", nullable: true })
  password: string | null;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("boolean", { name: "is_destroyed", default: () => "false" })
  isDestroyed: boolean;

  @ManyToOne(() => User, (user) => user.channels, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "owner_id", referencedColumnName: "id" }])
  owner: User;

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];

  @OneToMany(() => UserChannel, (userChannel) => userChannel.channel)
  userChannels: UserChannel[];
}
