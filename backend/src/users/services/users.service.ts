import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { AvatarService } from './avatar.service';
import { StatsService } from './stats.service';
import { Stats } from 'fs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        private readonly avatarService: AvatarService,
        private readonly statsService: StatsService
    ) {}

    async create(
        email: string, username: string, password: string): Promise<User> {
        
        const avatar = await this.avatarService.create(username);
        
        const stats = new Stats();

        const user = this.repo.create({ email, username, password, avatar });
        await this.repo.save(user);
        await this.statsService.create(user);
        // return this.repo.save(user);
        return user;


        // const avatar = await this.avatarService.create(username);
        // const stats = await this.statsService.create(0, 0, 0);
        // const user = this.repo.create({ email, username, password, avatar, stats });
        // return this.repo.save(user);
    }

    async update(user: User, attrs: Partial<User>) {
        return await this.repo.update(user, attrs);
    }

    async remove(user: User): Promise<User> {
        return await this.repo.remove(user);
    }

    async findById(id: number): Promise<User> {
        const user = await this.repo.findOne(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const users = await this.repo.find({ email });
        if (users.length === 0) { return null; }
        return users[0];
    }

    async findByName(username: string): Promise<User> {
        const users = await this.repo.find({ username });
        if (users.length === 0) { return null; }
        return users[0];
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
        const queryBuilder = this.repo.createQueryBuilder('user');
        queryBuilder.orderBy('user.username', 'DESC');
        return paginate<User>(queryBuilder, options);
    }

    async getUserWithAvatar(id: number): Promise<User> {
        const user = await this.repo.findOne(id, { relations: ["avatar"] });
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    async getUserWithStats(id: number): Promise<User> {
        const user = await this.repo.findOne(id, { relations: ["stats"] });
        if (!user) { throw new NotFoundException('user not found'); }
        return user;
    }

    async incVictories(id: number) {
        const user = await this.getUserWithStats(id);
        user.stats.victories += 1;
        return await this.repo.save(user);
    }

    async incLosses(id: number) {
        const user = await this.getUserWithStats(id);
        user.stats.losses += 1;
        return await this.repo.save(user);
    }

    async updateLevel(id: number, xp: number) {
        const user = await this.getUserWithStats(id);
        user.stats.level += xp;
        return await this.repo.save(user);
    }
}
