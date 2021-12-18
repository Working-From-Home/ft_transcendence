import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Channel } from "./Channel";
import { User } from "./User";

@Index("user_channel_pkey", ["channelId", "userId"], { unique: true })
@Entity("user_channel", { schema: "public" })
export class UserChannel {
  @Column("integer", { primary: true, name: "user_id" })
  userId: number;

  @Column("integer", { primary: true, name: "channel_id" })
  channelId: number;

  @Column("enum", {
    name: "role",
    enum: ["admin", "user"],
    default: () => "'user'",
  })
  role: "admin" | "user";

  @Column("timestamp with time zone", { name: "end_ban", nullable: true })
  endBan: Date | null;

  @Column("timestamp with time zone", { name: "end_mute", nullable: true })
  endMute: Date | null;

  @ManyToOne(() => Channel, (channel) => channel.userChannels, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "channel_id", referencedColumnName: "id" }])
  channel: Channel;

  @ManyToOne(() => User, (user) => user.userChannels, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
