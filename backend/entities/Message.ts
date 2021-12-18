import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Channel } from "./Channel";
import { User } from "./User";

@Index("message_pkey", ["id"], { unique: true })
@Entity("message", { schema: "public" })
export class Message {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Channel, (channel) => channel.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "channel_id", referencedColumnName: "id" }])
  channel: Channel;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
