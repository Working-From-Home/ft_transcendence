import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity';
import { Stats } from '../entities/stats.entity';

@Injectable()
export class StatsService {
    constructor(@InjectRepository(Stats) private repo: Repository<Stats>) {}

    async create(level: number, victories: number, losses: number) {
        const stats = this.repo.create({ level, victories, losses });
        return await this.repo.save(stats);
    }

    async find(userId: number) {
        const stats = await this.repo.findOne(userId);
        if (!stats) { throw new NotFoundException('user not found'); }
        return stats;
    }

    async incVictories(userId: number) {
        const userStats = await this.find(userId);
        Object.assign(userStats, { victories: userStats.victories + 1 });
        return this.repo.save(userStats);
    }

    async incLosses(userId: number) {
        const userStats = await this.find(userId);
        Object.assign(userStats, { losses: userStats.losses + 1 });
        return this.repo.save(userStats);
    }

    async updateLevel(userId: number, xp: number) {
        const userStats = await this.find(userId);
        Object.assign(userStats, { losses: userStats.level + xp });
        return this.repo.save(userStats);
    }
}
