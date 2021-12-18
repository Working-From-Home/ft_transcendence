import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("game_pkey", ["id"], { unique: true })
@Entity("game", { schema: "public" })
export class Game {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "winner_score" })
  winnerScore: number;

  @Column("integer", { name: "looser_score" })
  looserScore: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.games, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "looser_id", referencedColumnName: "id" }])
  looser: User;

  @ManyToOne(() => User, (user) => user.games2, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "winner_id", referencedColumnName: "id" }])
  winner: User;
}
