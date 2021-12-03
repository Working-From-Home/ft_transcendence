import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Friendship } from '../entities/friendship.entity';
import { Stats } from '../entities/stats.entity';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class FriendshipService {
    constructor(
        @InjectRepository(Friendship) private repo: Repository<Friendship>,
        private readonly usersService: UsersService
    ) {}

    async create(applicantId: number, recipientId: number) {
        const applicant = await this.usersService.findById(applicantId);
        const recipient = await this.usersService.findById(recipientId);
        const friendship = this.repo.create({ applicant, recipient, status: 'pending' });
        return await this.repo.save(friendship);
    }

    async update(friendship: Friendship, status: string) {
        Object.assign(friendship, status);
        return await this.repo.save(friendship);
    }

    async remove(friendship: Friendship) {
        return await this.repo.remove(friendship);
    }

    async getFriends(userId: number) {
        const user = await this.usersService.findById(userId);
        return await this.repo.find({
            where: [
                { applicant: user, status: 'accepted' },
                { recipient: user, status: 'accepted' },
            ],
            relations: ['applicant', 'recipient']});
    }

    getAcceptedFriends() {}

    getPendingFriends() {}

    getRejectedFriends() {}
}
