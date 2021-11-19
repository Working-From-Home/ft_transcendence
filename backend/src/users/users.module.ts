import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { AuthService } from './services/auth.service';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtConstants } from './constants'

import { JwtStrategy } from './strategies/jwt.strategy'

import { AuthController } from '../users/controllers/auth.controller';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [UsersService, AuthService, JwtStrategy],
    // exports: [UsersService],
    controllers: [UsersController, AuthController]
})
export class UsersModule {}
