import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    // @OneToOne(() => User, (user) => user.avatar, { primary: true, onDelete: "CASCADE" })
    // @JoinColumn({ name: 'userId' })
    // user: User;

    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column({ type: 'blob' })
    data: Uint8Array;

    @OneToOne(() => User, (user) => user.avatar, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user: User;
}
