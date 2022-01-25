import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { getRepository, Repository } from 'typeorm'
import { Channel } from './entities/channel.entity';

// tmp
import { ISearchChannel } from 'shared/models/socket-events'
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChatTmpService {
    constructor() {}

    async searchChannelsByTitle(title: string): Promise<ISearchChannel[]> {
        return getRepository(Channel).createQueryBuilder("channel")
            .where("title like :name ", {name: `%${title}%`} )
            .select(['channel.id', 'channel.title'])
            .getMany();
   }
}
