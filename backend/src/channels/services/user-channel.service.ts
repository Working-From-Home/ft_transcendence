import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserChannel } from '../entities/user-channel.entity';
import { ChannelsService } from './channels.service';

@Injectable()
export class UserChannelService {
    constructor(
        @InjectRepository(UserChannel) private repo: Repository<UserChannel>,
        private readonly channelService: ChannelsService
    ) {}

    async create(userId: number, channelId: number): Promise<UserChannel> {
        const channelUser = this.repo.create({ userId, channelId });
        await this.repo.save(channelUser);
        return channelUser;
    }

    async update(userId: number, channelId: number, attrs: Partial<UserChannel>) {
        const channelUser = await this.findChannelUser(userId, channelId);
        if (!channelUser) { throw new NotFoundException('user not found'); }
        return await this.repo.update(channelUser, attrs);
    }

    async isBanned(userId: number, channelId: number): Promise<boolean> {
        const channelUser = await this.findChannelUser(userId, channelId);
        if (!channelUser) { throw new NotFoundException('user not found'); }
        return channelUser.bannedUntil !== null;
    }

    async isMuted(userId: number, channelId: number): Promise<boolean> {
        const channelUser = await this.findChannelUser(userId, channelId);
        if (!channelUser) { throw new NotFoundException('user not found'); }
        return channelUser.mutedUntil !== null;
    }

    async isAdmin(userId: number, channelId: number): Promise<boolean> {
        const channelUser = await this.findChannelUser(userId, channelId);
        if (!channelUser) { throw new NotFoundException('user not found'); }
        return channelUser.role === 'admin';
    }

    async isOwner(userId: number, channelId: number): Promise<boolean> {
        const channel = await this.channelService.findById(channelId);
        return channel.owner.id === userId;
    }

    private async findChannelUser(userId: number, channelId: number): Promise<UserChannel> {
        return await this.repo.findOne({ where: [{ userId, channelId }] });
    }
}
