import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Avatar {
    @PrimaryColumn()
    userId: number;

    @OneToOne(() => User, (user) => user.avatar, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column({ type: 'bytea' })
    data: Uint8Array;
}
