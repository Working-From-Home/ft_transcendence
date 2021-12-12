import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Avatar {
    @PrimaryColumn()
    userId: number;

    @OneToOne(type => User, user => user.avatar, { primary: true, onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column({ type: 'blob' })
    data: Uint8Array;
}
