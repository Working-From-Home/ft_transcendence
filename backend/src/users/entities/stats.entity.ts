import { Expose } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn,
    OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Stats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Expose()
    level: number;

    @Column()
    @Expose()
    victories: number;

    @Column()
    @Expose()
    losses: number;

    @OneToOne(() => User, (user) => user.stats, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user: User;
}