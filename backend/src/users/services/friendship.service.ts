import { BadRequestException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Friendship, FriendshipStatus } from '../entities/friendship.entity';
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
        if (applicantId === recipientId) { throw new BadRequestException; }
        const applicant = await this.usersService.findById(applicantId);
        const recipient = await this.usersService.findById(recipientId);
        const friendship = this.repo.create({ applicant, recipient, status: 'pending' });
        return await this.repo.save(friendship);
    }

    async update(friendship: Friendship, status: FriendshipStatus) {
        Object.assign(friendship, status);
        return await this.repo.save(friendship);
    }

    async remove(friendship: Friendship) {
        return await this.repo.remove(friendship);
    }

    async findByStatus(userId: number, status: FriendshipStatus) {
        const user = await this.usersService.findById(userId);
        return await this.repo.find({
            where: [
                { applicant: user, status },
                { recipient: user, status },
            ],
            relations: ['applicant', 'recipient']});
    }
}
