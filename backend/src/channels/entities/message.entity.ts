import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Channel } from "./channel.entity";

  @Entity()
  export class Message {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number;
  
    @Column({ type: "text" })
    content: string;
  
    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
  
    @ManyToOne(() => Channel, (channel) => channel.messages, { onDelete: "CASCADE" })
    @JoinColumn()
    channel: Channel;
  
    @ManyToOne(() => User, (user) => user.messages, { onDelete: "SET NULL" })
    @JoinColumn()
    user: User;
}