import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entities/avatar.entity';
import { User } from './entities/user.entity';
import { AvatarService } from './services/avatar.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { MeController } from './controllers/me.controller';
import { Stats } from './entities/stats.entity';
import { StatsService } from './services/stats.service';

@Module({
    imports: [TypeOrmModule.forFeature([Avatar, User, Stats])],
    providers: [UsersService, AvatarService, StatsService],
    controllers: [UsersController, MeController],
    exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
