import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { UserChannel } from '../entities/user-channel.entity';

@Injectable()
export class UserChannelService {
    constructor(
        @InjectRepository(UserChannel) private repo: Repository<UserChannel>
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
        const channel = await getRepository(Channel)
            .createQueryBuilder("channel")
            .where("channel.id = :id", { id: channelId })
            .getOne();
        return channel.owner.id === userId;
    }

    private async findChannelUser(userId: number, channelId: number): Promise<UserChannel> {
        return await this.repo.findOne({ where: [{ userId, channelId }] });
    }
}
