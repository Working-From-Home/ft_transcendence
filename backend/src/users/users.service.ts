import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, username: string, password: string) {
        const user = this.repo.create({ email, username, password });
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return this.repo.remove(user);
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
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
}
