import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtConstants } from '../auth/constants'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [UsersService, AuthService],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}
