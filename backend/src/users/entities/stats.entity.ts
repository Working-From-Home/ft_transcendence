import { Expose } from "class-transformer";
import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Stats {
    @OneToOne(type => User, user => user.stats, { primary: true, onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: 0 })
    @Expose()
    level: number;

    @Column({ default: 0 })
    @Expose()
    victories: number;

    @Column({ default: 0 })
    @Expose()
    losses: number;
}