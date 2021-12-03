import {
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserGuard } from 'src/auth/guards/current-user.guard';
import { FriendshipService } from '../services/friendship.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersPaginationDto } from '../dtos/users-pagination.dto';
import { User } from '../entities/user.entity';

@ApiTags('friends')
@Controller('/users/:id/friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(
        private usersService: UsersService,
        private friendshipService: FriendshipService
    ) {}

    @Get()
    @Serialize(UsersPaginationDto)
    async getFriends(@Param('id') userId: string) {
        return await this.friendshipService.getFriends(parseInt(userId));
    }

    @Get()
    @Serialize(UsersPaginationDto)
    async getPendingFriends(@Param('id') userId: string) {}

    @Post('/:recipientId')
    @UseGuards(CurrentUserGuard)
    async sendFriendRequest(
        @Param('id') userId: string,
        @Param('recipientId') recipientId: string
    ) {
        return await this.friendshipService.create(parseInt(userId), parseInt(recipientId));
    }

    @Patch()
    @UseGuards(CurrentUserGuard)
    async acceptFriendRequest(
        @Param('id') userId: string,
    ) {

    }

    @Delete('/:recipientId')
    @UseGuards(CurrentUserGuard)
    async breakFriendship(
        @Param('id') userId: string,
        @Param('recipientId') recipientId: string
    ) {}
}