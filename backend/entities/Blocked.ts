import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Index("blocked_pkey", ["applicantId", "recipientId"], { unique: true })
@Entity("blocked", { schema: "public" })
export class Blocked {
  @Column("integer", { primary: true, name: "applicant_id" })
  applicantId: number;

  @Column("integer", { primary: true, name: "recipient_id" })
  recipientId: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.blockeds, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "applicant_id", referencedColumnName: "id" }])
  applicant: User;

  @ManyToOne(() => User, (user) => user.blockeds2, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "recipient_id", referencedColumnName: "id" }])
  recipient: User;
}
