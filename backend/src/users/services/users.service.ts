import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity';
import { AvatarService } from './avatar.service';

import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        private readonly avatarService: AvatarService
    ) {}

    async create(email: string, username: string, password: string) {
        const avatar = await this.avatarService.create(username);
        const user = this.repo.create({ email, username, password, avatar });
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findById(id);
        if (!user) { throw new NotFoundException('user not found'); }
        return await this.avatarService.remove(user.avatarId);
    }

    findById(id: number) {
        if (!id) { return null; }
        return this.repo.findOne(id);
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
