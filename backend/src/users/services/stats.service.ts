import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity';
import { Stats } from '../entities/stats.entity';

@Injectable()
export class StatsService {
    constructor(@InjectRepository(Stats) private repo: Repository<Stats>) {}

    async create(user: User) {
        const stats = this.repo.create({ userId: user.id });
        return await this.repo.save(stats);
    }

    async incVictories(user: User) {
        const stats = await this.repo.findOne(user.id);
        if (!stats) { throw new NotFoundException('stats not found'); }
        stats.victories += 1;
        return await this.repo.save(stats);
    }

    async incLosses(user: User) {
        const stats = await this.repo.findOne(user.id);
        if (!stats) { throw new NotFoundException('stats not found'); }
        stats.losses += 1;
        return await this.repo.save(stats);
    }

    async updateLevel(userId: number, xp: number) {}
}
