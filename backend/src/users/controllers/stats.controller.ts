import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { StatsService } from '../services/stats.service';

@ApiTags('users')
@Controller('users/:id/stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
    constructor(private statsService: StatsService) {}

    @Patch('/victories')
    @UseGuards(CurrentUserGuard)
    async incrementVictories(@Param('id', ParseIntPipe) userId: number) {
        return await this.statsService.incVictories(userId);
    }

    @Patch('/losses')
    @UseGuards(CurrentUserGuard)
    async incrementLosses(@Param('id', ParseIntPipe) userId: number) {
        return await this.statsService.incLosses(userId);
    }

    @Patch('/level')
    @UseGuards(CurrentUserGuard)
    async updateLevel(
        @Param('id', ParseIntPipe) userId: number,
        @Body() xp: number
    ) {
        return await this.statsService.updateLevel(userId, xp);
    }
}