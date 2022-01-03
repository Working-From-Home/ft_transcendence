import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/entities/game.entity';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { UserChannel } from './entities/user-channel.entity';
import { ChannelsController } from './controllers/channels.controller';
import { ChannelsService } from './channels.service';

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


    ChannelsService],
    controllers: [

    ChannelsController],
    exports: [

    ]
})
export class ChannelsModule {}