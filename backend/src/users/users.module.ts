import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entities/avatar.entity';
import { User } from './entities/user.entity';
import { AvatarService } from './services/avatar.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { Stats } from './entities/stats.entity';
import { StatsService } from './services/stats.service';
import { AvatarController } from './controllers/avatar.controller';
import { Friendship } from './entities/friendship.entity';
import { FriendshipService } from './services/friendship.service';
import { FriendsController } from './controllers/friends.controller';
import { StatsController } from './controllers/stats.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Avatar,
            User,
            Stats,
            Friendship
        ])
    ],
    providers: [
        UsersService,
        AvatarService,
        StatsService,
        FriendshipService
    ],
    controllers: [
        UsersController,
        AvatarController,
        StatsController,
        FriendsController
    ],
    exports: [
        UsersService,
        TypeOrmModule
    ]
})
export class UsersModule {}
