import {
    BadRequestException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { FriendshipService } from '../services/friendship.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { Friendship } from '../entities/friendship.entity';
import { FriendshipDto } from '../dtos/friendship.dto';
import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@ApiTags('friends')
@Controller('/users/:id/friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(private friendshipService: FriendshipService) {}

    @Get()
    @Serialize(UserDto)
    // @UseGuards(CurrentUserGuard)
    async getFriendshipsByStatus(
        @Param('id', ParseIntPipe) userId: number,
        @Query('status') status?: string
    ): Promise<User[]> {
        let users: User[];
        if (status === 'accepted') {
            users = await this.friendshipService.getFriends(userId);
        } else if (status === 'pending') {
            users = await this.friendshipService.getPendings(userId);
        } else {
            throw new BadRequestException('bad status');
        }
        return users;
    }

    @Post('/:recipientId')
    @UseGuards(CurrentUserGuard)
    @Serialize(FriendshipDto)
    async initiateFriendship(
        @Param('id', ParseIntPipe) applicantId: number,
        @Param('recipientId', ParseIntPipe) recipientId: number,
    ): Promise<Friendship> {
        if (await this.friendshipService.twoWaySearch(applicantId, recipientId)) {
            throw new BadRequestException('the relationship already exists');
        }
        return await this.friendshipService.create(applicantId, recipientId);
    }

    @Patch('/:applicantId')
    @UseGuards(CurrentUserGuard)
    @Serialize(FriendshipDto)
    async acceptFriendship(
        @Param('id', ParseIntPipe) recipientId: number,
        @Param('applicantId', ParseIntPipe) applicantId: number,
    ): Promise<Friendship> {
        const friendship = await this.friendshipService.oneWaySearch(applicantId, recipientId, 'pending');
        if (!friendship) { throw new NotFoundException('request not found') }
        return await this.friendshipService.accept(friendship);
    }

    @Delete('/:friendId')
    @UseGuards(CurrentUserGuard)
    @Serialize(FriendshipDto)
    async removeFriendship(
        @Param('id', ParseIntPipe) lhsId: number,
        @Param('friendId', ParseIntPipe) rhsId: number
    ): Promise<Friendship> {
        const friendship = await this.friendshipService.twoWaySearch(lhsId, rhsId);
        if (!friendship) { throw new NotFoundException('request not found'); }
        return await this.friendshipService.remove(friendship);
    }
}