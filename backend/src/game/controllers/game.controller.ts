import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Game } from '../entities/game.entity';
import { GameService } from '../services/game.service';
import { GamesPaginationDto } from '../dtos/games-pagination.dto'
import { Serialize } from '../../interceptors/serialize.interceptor';
import JwtTwoFaGuard from 'src/auth/guards/jwt-two-fa.guard';

@Controller('game')
@UseGuards(JwtAuthGuard, JwtTwoFaGuard)
export class GameController {
	constructor(private gameService : GameService) {}

	@Get('/:userId')
	async getUserGames(@Param('userId', ParseIntPipe) userId: number): Promise<Game[]> {
		const games = await this.gameService.getGames(userId);
		if (!games.length)
			return null;
		return games;
	}

	@Get('/:userId/pagination')
	@Serialize(GamesPaginationDto)
	async getIndex(
		@Param('userId', ParseIntPipe) userId: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Game>> {
        limit = limit > 100 ? 100 : limit;
        return await this.gameService.paginate(userId, { page, limit, route: '/game/' + userId + '/pagination'});
    }
}
