import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Game } from '../entities/game.entity';
import { GameService } from '../services/game.service';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
	constructor(private gameService : GameService) {}

	@Get('/:userId')
	async getUserGames(@Param('userId', ParseIntPipe) userId: number): Promise<Game[]> {
		const games = await this.gameService.getGames(userId);
		if (!games.length)
			return null;
		return games;
	}
}
