import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
  
@Entity()
export class Achievement {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number;

    @Column({ type: "text", unique: true })
    title: string;

    @Column({ type: "text" })
    description: string;

    @ManyToMany(() => User, (user) => user.achievements)
    @JoinTable({
        name: "user_achievement",
        joinColumns: [{ name: "achievementId", referencedColumnName: "id" }],
        inverseJoinColumns: [{ name: "userId", referencedColumnName: "id" }]
    })
    users: User[];
}
