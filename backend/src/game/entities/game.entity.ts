import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Check } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
@Check(`"winnerId" <> "looserId"`)
export class Game {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number;

    @Column({ type: "integer" })
    winnerScore: number;

    @Column({ type: "integer" })
    looserScore: number;

    @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
    
		@ManyToOne(() => User, (user) => user.wonGames, { onDelete: "SET NULL" })
    @JoinColumn()
    winner: User;
		
    @ManyToOne(() => User, (user) => user.lossedGames, { onDelete: "SET NULL" })
    @JoinColumn()
    looser: User;

}
  