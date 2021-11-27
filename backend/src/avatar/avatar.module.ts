import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Avatar } from './avatar.entity';
import { AvatarService } from './avatar.service'
import { AvatarController } from './avatar.controller';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        TypeOrmModule.forFeature([Avatar])
    ],
    providers: [AvatarService],
    controllers: [AvatarController],
    exports: [AvatarService]
})
export class AvatarModule {}
