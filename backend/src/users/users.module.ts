import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarModule } from '../avatar/avatar.module';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [
        forwardRef(() => AvatarModule),
        TypeOrmModule.forFeature([User])
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
