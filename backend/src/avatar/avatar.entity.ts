import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column({ type: 'blob' })
    data: Uint8Array;

    @OneToOne(() => User, user => user.avatar, { onDelete: "CASCADE" })
    user: User;
}
