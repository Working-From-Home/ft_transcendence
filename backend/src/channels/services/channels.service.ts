import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import { UserChannelService } from './user-channel.service';
import { CreateChannelDto } from '../dtos/create-channel.dto';

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel) private repo: Repository<Channel>,
        private userChannelService: UserChannelService
    ) {}

    async create(data: CreateChannelDto): Promise<Channel> {
        const channel = this.repo.create(data);
        await this.repo.save(channel);
        return channel;
    }

    async update(channelId: number, attrs: Partial<Channel>) {
        const channel = await this.findById(channelId);
        return await this.repo.update(channel, attrs);
    }

    async remove(channel: Channel): Promise<Channel> {
        return await this.repo.remove(channel);
    }

    async findById(id: number): Promise<Channel> {
        const channel = await this.repo.findOne(id);
        if (!channel) { throw new NotFoundException('channel not found'); }
        return channel;
    }

    async findByIds(ids: number[]): Promise<Channel[]> {
        const channels = await this.repo.findByIds(ids);
        return channels;
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Channel>> {
        const queryBuilder = this.repo.createQueryBuilder('channel');
        queryBuilder.orderBy('channel.createdAt', 'DESC');
        return paginate<Channel>(queryBuilder, options);
    }

    async join(channelId: number, userId: number) {
        await this.findById(channelId);
        return this.userChannelService.create(userId, channelId);
    }

    async leave(channelId: number, userId: number) {
        await this.findById(channelId);
        return this.userChannelService.update(userId, channelId, { hasLeft: true });
    }

    async addAdmin(channelId: number, userId: number) {
        await this.findById(channelId);
        return this.userChannelService.update(userId, channelId, { role: 'admin' });
    }

    async removeAdmin(channelId: number, userId: number) {
        await this.findById(channelId);
        return this.userChannelService.update(userId, channelId, { role: 'user' });
    }

    async banUser(channelId: number, userId: number, date: Date) {
        await this.findById(channelId);
        return this.userChannelService.update(userId, channelId, { bannedUntil: date });
    }

    async muteUser(channelId: number, userId: number, date: Date) {
        await this.findById(channelId);
        return this.userChannelService.update(userId, channelId, { mutedUntil: date });
    }

    async unbanUser(channelId: number, userId: number) {
        await this.findById(channelId);
        return this.userChannelService.update(userId, channelId, { bannedUntil: null });
    }

    async unmuteUser(channelId: number, userId: number) {
        await this.findById(channelId);
        return this.userChannelService.update(userId, channelId, { mutedUntil: null });
    }

    async isChannelPublic(channelId: number): Promise<boolean> {
        const channel = await this.findById(channelId);
        return channel.password === null && channel.isDm === false;
    }

    async isChannelDM(channelId: number): Promise<boolean> {
        const channel = await this.findById(channelId);
        return channel.isDm;
    }
}
