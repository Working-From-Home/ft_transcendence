import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { AvatarService } from './avatar.service';
import { StatsService } from './stats.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        private readonly avatarService: AvatarService,
        private readonly statsService: StatsService
    ) {}

    async create(email: string, username: string, password: string) {
        const avatar = await this.avatarService.create(username);
        const stats = await this.statsService.create(0, 0, 0);
        const user = this.repo.create({ email, username, password, avatar, stats });
        return this.repo.save(user);
    }

    async remove(user: User) {
        return await this.repo.remove(user);
    }

    async findById(id: number) {
        const user = await this.repo.findOne(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    async findByEmail(email: string) {
        const users = await this.repo.find({ email });
        if (users.length === 0) { return null; }
        return users[0];
    }

    async findByName(username: string) {
        const users = await this.repo.find({ username });
        if (users.length === 0) { return null; }
        return users[0];
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
        const queryBuilder = this.repo.createQueryBuilder('user');
        queryBuilder.orderBy('user.username', 'DESC');
        return paginate<User>(queryBuilder, options);
    }
}
