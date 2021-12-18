import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("achievement_pkey", ["id"], { unique: true })
@Index("achievement_title_key", ["title"], { unique: true })
@Entity("achievement", { schema: "public" })
export class Achievement {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "title", unique: true })
  title: string;

  @Column("text", { name: "description" })
  description: string;

  @ManyToMany(() => User, (user) => user.achievements)
  @JoinTable({
    name: "user_achievement",
    joinColumns: [{ name: "achievement_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    schema: "public",
  })
  users: User[];
}
