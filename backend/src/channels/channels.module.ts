import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { UserChannel } from './entities/user-channel.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Message,
            UserChannel,
            Channel
        ])
    ],
    providers: [


    ],
    controllers: [

    ],
    exports: [

    ]
})
export class ChannelsModule {}