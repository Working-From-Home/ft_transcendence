import {
    BadRequestException,
    Body,
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
import { UsersPaginationDto } from '../dtos/users-pagination.dto';
import { FriendshipStatus } from '../entities/friendship.entity';
import { FriendshipsPaginationDto } from '../dtos/friendships-pagination.dto';
import { UpdateFriendshipDto } from '../dtos/update-friendship.dto';

@ApiTags('friends')
@Controller('/users/:id/friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
    constructor(private friendshipService: FriendshipService) {}

    @Get()
    @Serialize(FriendshipsPaginationDto)
    async filterFriendshipsByStatus(
        @Param('id') userId: string,
        @Query('status') status: FriendshipStatus
    ) {
        return await this.friendshipService.findByStatus(parseInt(userId), status);
    }

    @Post('/:recipientId')
    @UseGuards(CurrentUserGuard)
    async initiateFriendship(
        @Param('id', ParseIntPipe) applicantId: number,
        @Param('recipientId', ParseIntPipe) recipientId: number
    ) {
        if (await this.friendshipService.findTwoDirections(applicantId, recipientId)) {
            throw new BadRequestException('a request has already been sent');
        }
        return await this.friendshipService.create(applicantId, recipientId);
    }

    @Patch('/:applicantId')
    @UseGuards(CurrentUserGuard)
    async updateFriendship(
        @Param('id', ParseIntPipe) recipientId: number,
        @Param('applicantId', ParseIntPipe) applicantId: number,
        @Body() body: UpdateFriendshipDto
    ) {
        const friendship = await this.friendshipService.findOneDirection(applicantId, recipientId);
        if (!friendship) {
            throw new NotFoundException('request not found')
        }
        return await this.friendshipService.update(friendship, body);
    }

    @Delete('/:recipientId')
    @UseGuards(CurrentUserGuard)
    async removeFriendship(
        @Param('id', ParseIntPipe) applicantId: number,
        @Param('recipientId', ParseIntPipe) recipientId: number
    ) {
        const friendship = await this.friendshipService.findTwoDirections(applicantId, recipientId);
        if (!friendship) { throw new NotFoundException('request not found'); }
        return await this.friendshipService.remove(friendship);
    }
}