import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Friendship } from '../entities/friendship.entity';
import { UsersService } from './users.service';

@Injectable()
export class FriendshipService {
    constructor(
        @InjectRepository(Friendship) private repo: Repository<Friendship>,
        private readonly usersService: UsersService
    ) {}

    async create(applicantId: number, recipientId: number): Promise<Friendship> {
        if (applicantId === recipientId) { throw new BadRequestException; }
        const applicant = await this.usersService.findById(applicantId);
        const recipient = await this.usersService.findById(recipientId);
        const friendship = this.repo.create({ applicant, recipient });
        return await this.repo.save(friendship);
    }

    async accept(friendship: Friendship): Promise<Friendship> {
        Object.assign(friendship, { status: 'accepted' });
        return await this.repo.save(friendship);
    }

    async remove(friendship: Friendship): Promise<Friendship> {
        return await this.repo.remove(friendship);
    }

    async findByStatus(userId: number, status: string): Promise<Friendship[]> {
        const user = await this.usersService.findById(userId);
        return await this.repo.find({
            where: [
                { applicant: user, status },
                { recipient: user, status },
            ],
            relations: ['applicant', 'recipient']
        });
    }

   async getFriendships(userId: number, status: string) {
        const friendships = await this.findByStatus(userId, status);
        let ids: number[] = [];
        friendships.forEach((friendship: Friendship) => {
            if (friendship.applicant.id === userId) {
                ids.push(friendship.recipient.id);
            } else if (friendship.recipient.id === userId) {
                ids.push(friendship.applicant.id);
            }
        })
        return await this.usersService.findByIds(ids);
    };

    async oneWaySearch(applicantId: number, recipientId: number, status?: string): Promise<Friendship> {
        const applicant = await this.usersService.findById(applicantId);
        const recipient = await this.usersService.findById(recipientId);
        return await this.repo.findOne({
            where: [
                { applicant, recipient, status },
            ],
            relations: ['applicant', 'recipient']
        });
    }

    async twoWaySearch(lhsId: number, rhsId: number, status?: string): Promise<Friendship> {
        const lhs = await this.usersService.findById(lhsId);
        const rhs = await this.usersService.findById(rhsId);
        return await this.repo.findOne({
            where: [
                { applicant: lhs, recipient: rhs, status },
                { applicant: rhs, recipient: lhs, status },
            ],
            relations: ['applicant', 'recipient']
        });
    }
}
