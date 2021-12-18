import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Index("friendship_pkey", ["applicantId", "recipientId"], { unique: true })
@Entity("friendship", { schema: "public" })
export class Friendship {
  @Column("integer", { primary: true, name: "applicant_id" })
  applicantId: number;

  @Column("integer", { primary: true, name: "recipient_id" })
  recipientId: number;

  @Column("enum", {
    name: "status",
    enum: ["accepted", "pending"],
    default: () => "'pending'",
  })
  status: "accepted" | "pending";

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.friendships, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "applicant_id", referencedColumnName: "id" }])
  applicant: User;

  @ManyToOne(() => User, (user) => user.friendships2, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "recipient_id", referencedColumnName: "id" }])
  recipient: User;
}
