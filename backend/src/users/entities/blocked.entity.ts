import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from './user.entity'

@Entity()
export class Blocked {
    @PrimaryColumn({ type: "integer" })
    applicantId: number;

    @PrimaryColumn({ type: "integer" })
    recipientId: number;

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.usersBlocked, { onDelete: "CASCADE" })
    @JoinColumn()
    applicant: User;

    @ManyToOne(() => User, (user) => user.BlockedBy, { onDelete: "CASCADE" })
    @JoinColumn()
    recipient: User;
}