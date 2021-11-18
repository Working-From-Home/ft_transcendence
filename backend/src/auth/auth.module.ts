import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { AuthController } from './auth.controller';

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([User])],
    providers: [AuthService, UsersService],
    controllers: [AuthController]
})
export class AuthModule {}
