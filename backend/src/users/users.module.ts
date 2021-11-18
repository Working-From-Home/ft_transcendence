import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, AuthService],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}
