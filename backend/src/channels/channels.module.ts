import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/entities/game.entity';
import { ChatTmpService } from './chat.tmp.service';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { UserChannel } from './entities/user-channel.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Message,
            UserChannel,
            Channel,
            Game
        ])
    ],
    providers: [
        ChatTmpService
    ],
    controllers: [

    ],
    exports: [
        ChatTmpService
    ]
})
export class ChannelsModule {}