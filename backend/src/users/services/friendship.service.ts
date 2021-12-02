import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Stats } from '../entities/stats.entity';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class FriendshipService {
    // constructor(
    //     @InjectRepository(Friendship) private repo: Repository<Friendship>,
    //     private readonly usersService: UsersService
    // ) {}

    // sendFriendRequest(applicantId: number, recipientId: number) {
    //     const friendship = this.repo.create(applicantId, recipientId, status: 'pending');
    // }

    acceptFriendRequest() {}

    declineFriendRequest() {}

    getFriends() {}

    getAcceptedFriends() {}

    getPendingFriends() {}

    getRejectedFriends() {}
}
