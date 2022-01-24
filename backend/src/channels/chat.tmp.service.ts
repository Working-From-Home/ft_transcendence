import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { getRepository, Repository } from 'typeorm'
import { Channel } from './entities/channel.entity';

// tmp
// import { ISearchChannel } from 'shared/models/socket-events'

@Injectable()
export class ChatTmpService {
    constructor() {}

    // async searchChannelsByTitle(title: string): Promise<ISearchChannel[]> {
    async searchChannelsByTitle(title: string): Promise<{id: number, title: string}[]> {
        return await getRepository(Channel).createQueryBuilder()
            .where("title like :name ", {name: `%${title}%`} )
            .select(['id', 'title'])
            .getMany();
    }
}
