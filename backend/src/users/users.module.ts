import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { AvatarService } from './services/avatar.service'
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { Avatar } from './entities/avatar.entity';
import { AvatarController } from './controllers/avatar.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Avatar])],
    providers: [UsersService, AvatarService],
    controllers: [UsersController, AvatarController],
    exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
