import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "../entities/game.entity";
import { IGameStats } from "src/pong/classAndTypes/IGameStats";
import { UsersService } from "src/users/services/users.service";
import { StatsService } from "src/users/services/stats.service";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class GameService {
  constructor(
		@InjectRepository(Game) private repo : Repository<Game>,
		private readonly usersService : UsersService,
		private readonly statsService : StatsService
	) {}

	async create(gameStats : IGameStats) {
		const winner = await this.usersService.findById(gameStats.winnerId);
		const looser = await this.usersService.findById(gameStats.looserId);
		const winnerScore = gameStats.winnerScore;
		const looserScore = gameStats.looserScore;
		this.statsService.incVictories(winner);
		this.statsService.incLosses(looser);
		const	game = this.repo.create({
			winnerScore, 
			looserScore, 
			winner,
			looser
		});
		return await this.repo.save(game);
	}

	async getGames(userId: number) : Promise<Game[]> {
		const user = await this.usersService.findById(userId);
		const games = await this.repo.find({
			where: [
				{ looser: user },
				{ winner: user }
			],
			order: { id: "DESC" },
			relations: ['winner', 'looser']
		});
		return games;
	}

	async paginate(userId: number, options: IPaginationOptions): Promise<Pagination<Game>> {
		const queryBuilder = this.repo.createQueryBuilder('game');
		queryBuilder.leftJoinAndSelect("game.winner", "winner");
		queryBuilder.leftJoinAndSelect("game.looser", "looser");
		queryBuilder.where("winner.id = :id", { id: userId });
		queryBuilder.orWhere("looser.id = :id", { id: userId })
		queryBuilder.orderBy('game.id', 'DESC');
		return paginate<Game>(queryBuilder, options);
	}
}