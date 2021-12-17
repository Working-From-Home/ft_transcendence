import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Stats {
    @PrimaryColumn()
    userId: number;

    @OneToOne(type => User, user => user.stats, { primary: true, onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: 0 })
    level: number;

    @Column({ default: 0 })
    victories: number;

    @Column({ default: 0 })
    losses: number;
}