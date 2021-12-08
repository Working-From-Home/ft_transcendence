import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { StatsService } from '../services/stats.service';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users/:id/stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
    constructor(private statsService: StatsService, private usersService: UsersService) {}

    @Get()
    @UseGuards(CurrentUserGuard)
    async getStats(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.getUserWithStats(id);
        return user.stats;
    }

    @Patch('/victories')
    @UseGuards(CurrentUserGuard)
    async incrementVictories(@Param('id', ParseIntPipe) userId: number) {
        return await this.usersService.incVictories(userId);
        // return await this.statsService.incVictories(userId);
    }

    @Patch('/losses')
    @UseGuards(CurrentUserGuard)
    async incrementLosses(@Param('id', ParseIntPipe) userId: number) {
        return await this.usersService.incLosses(userId);
        // return await this.statsService.incLosses(userId);
    }
}