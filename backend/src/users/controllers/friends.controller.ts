import {
    Controller,
    Delete,
    Get,
    Param,
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
import { UsersPaginationDto } from '../dtos/users-pagination.dto';
import { FriendshipStatus } from '../entities/friendship.entity';

@ApiTags('friends')
@Controller('/users/:id/friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(private friendshipService: FriendshipService) {}

    @Get()
    @Serialize(UsersPaginationDto)
    async getFriendshipsByStatus(
        @Param('id') userId: string,
        @Query('status') status: FriendshipStatus
    ) {
        return await this.friendshipService.findByStatus(parseInt(userId), status);
    }

    @Post('/:recipientId')
    @UseGuards(CurrentUserGuard)
    async sendRequest(
        @Param('id') userId: string,
        @Param('recipientId') recipientId: string
    ) {
        return await this.friendshipService.create(parseInt(userId), parseInt(recipientId));
    }

    @Patch()
    @UseGuards(CurrentUserGuard)
    async respondToRequest(
        @Param('id') userId: string,
    ) {

    }

    @Delete('/:recipientId')
    @UseGuards(CurrentUserGuard)
    async breakFriendship(
        @Param('id') userId: string,
        @Param('recipientId') recipientId: string
    ) {
        
    }
}