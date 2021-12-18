import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { User } from "./User";

@Index("avatar_pkey", ["userId"], { unique: true })
@Entity("avatar", { schema: "public" })
export class Avatar {
  @Column("integer", { primary: true, name: "user_id" })
  userId: number;

  @Column("text", { name: "filename" })
  filename: string;

  @Column("text", { name: "mimetype" })
  mimetype: string;

  @Column("bytea", { name: "data" })
  data: Buffer;

  @OneToOne(() => User, (user) => user.avatar, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
