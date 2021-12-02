import { Injectable } from '@nestjs/common';
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

    incVictories(user: User) {
        user.stats.victories += 1;
    }

    incLosses(user: User) {
        user.stats.losses += 1;
    }

    updateLevel(user: User, xp: number) {
        user.stats.level += xp;
    }
}
