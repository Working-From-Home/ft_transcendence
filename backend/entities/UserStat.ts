import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { User } from "./User";

@Index("user_stat_pkey", ["userId"], { unique: true })
@Entity("user_stat", { schema: "public" })
export class UserStat {
  @Column("integer", { primary: true, name: "user_id" })
  userId: number;

  @Column("integer", { name: "level", default: () => "0" })
  level: number;

  @Column("integer", { name: "victories", default: () => "0" })
  victories: number;

  @Column("integer", { name: "losses", default: () => "0" })
  losses: number;

  @OneToOne(() => User, (user) => user.userStat, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
