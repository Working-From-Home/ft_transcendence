import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Check } from "typeorm";
import { User } from "./user.entity";

@Entity()
@Check(`"applicantId" <> "recipientId"`)
export class Friendship {
    @PrimaryColumn()
    applicantId: number;

    @PrimaryColumn()
    recipientId: number;

    @Column({ type: "enum", enum: ["accepted", "pending"], default: "pending" })
    status: "accepted" | "pending";

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => User, user => user.sentFriendRequests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'applicantId' })
    applicant: User;

    @ManyToOne(() => User, user => user.receivedFriendRequests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipientId' })
    recipient: User;
}