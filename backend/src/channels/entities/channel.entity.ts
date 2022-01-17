import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Message } from "./message.entity";
import { UserChannel } from "./user-channel.entity";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number;

    @Column({ type: "boolean" })
    isDm: boolean;

    @Index()
    @Column({ type: "text", nullable: true })
    title: string | null;

    @Column({ type: "text", nullable: true })
    password: string | null;

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.channels, { onDelete: "SET NULL" })
    @JoinColumn()
    owner: User;

    @OneToMany(() => Message, (message) => message.channel)
    messages: Message[];

    @OneToMany(() => UserChannel, (userChannel) => userChannel.channel)
    userChannels: UserChannel[];
}