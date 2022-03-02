import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Friendship } from '../entities/friendship.entity';
import { User } from '../entities/user.entity';
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

    async getFriends(userId: number): Promise<User[]> {
        const user = await this.usersService.findById(userId);
        const friends = await this.repo.find({
            where: [
                { applicant: user, status: 'accepted' },
                { recipient: user, status: 'accepted' },
            ],
            relations: ['applicant', 'recipient']
        });
        return await this.formatOutput(userId, friends);
    }

    async getPendings(userId: number): Promise<User[]> {
        const user = await this.usersService.findById(userId);
        const requests = await this.repo.find({
            where: [{ recipient: user, status: 'pending' }],
            relations: ['applicant', 'recipient']
        });
        return await this.formatOutput(userId, requests);
    }

    async getSentRequests(userId: number): Promise<User[]> {
        const user = await this.usersService.findById(userId);
        const pendings = await this.repo.find({
            where: [{ applicant: user, status: 'pending' }],
            relations: ['applicant', 'recipient']
        });
        return await this.formatOutput(userId, pendings);
    }

    async oneWaySearch(applicantId: number, recipientId: number, status?: string): Promise<Friendship> {
        const applicant = await this.usersService.findById(applicantId);
        const recipient = await this.usersService.findById(recipientId);
        return await this.repo.findOne({
            where: [{ applicant, recipient, status }],
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

    private async formatOutput(userId: number, friendships: Friendship[]): Promise<User[]> {

        console.log("FRIENDSHIPS=", friendships);
        let ids: number[] = [];
        friendships.forEach((friendship: Friendship) => {
            if (friendship.applicant.id === userId) {
                ids.push(friendship.recipient.id);
            } else if (friendship.recipient.id === userId) {
                ids.push(friendship.applicant.id);
            }
        })
        return await this.usersService.findByIds(ids);
    }
}
