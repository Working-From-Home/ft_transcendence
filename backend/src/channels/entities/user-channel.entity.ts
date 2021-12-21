import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Channel } from "./channel.entity";

@Entity()
export class UserChannel {
    @PrimaryColumn({ type: "integer" })
    userId: number;

    @PrimaryColumn({ type: "integer" })
    channelId: number;

    @Column("enum", { enum: ["admin", "user"], default: () => "'user'" })
    role: "admin" | "user";

    @Column({ type: 'timestamptz', nullable: true })
    bannedUntil: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    mutedUntil: Date | null;

    @ManyToOne(() => Channel, (channel) => channel.userChannels, { onDelete: "CASCADE" })
    @JoinColumn()
    channel: Channel;

    @ManyToOne(() => User, (user) => user.userChannels, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;
}
