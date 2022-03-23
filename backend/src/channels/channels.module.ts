import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/entities/game.entity';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { UserChannel } from './entities/user-channel.entity';
import { Blocked } from '../users/entities/blocked.entity';
import { ChannelsController } from './controllers/channels.controller';
import { ChatService } from './services/chat.service';
import { UsersModule } from 'src/users/users.module';
import { AppGateway } from 'src/app.gateway';
import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Message,
            UserChannel,
            Channel,
            Game,
			Blocked
        ]),
        UsersModule,
		AuthModule,
		forwardRef(() => AppModule),
    ],
    providers: [
        ChatService,
    ],
    controllers: [
        ChannelsController
    ],
    exports: [
        ChatService,
    ]
})
export class ChannelsModule {}