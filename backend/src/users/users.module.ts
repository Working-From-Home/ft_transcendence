import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './controllers/users.controller';
import { AuthController } from '../users/controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy'
import { jwtConstants } from './constants' // tmp

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
    controllers: [UsersController, AuthController]
})
export class UsersModule {}
