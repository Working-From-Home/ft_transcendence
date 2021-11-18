import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [AuthService, UsersService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
