import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy'
import { GoogleStrategy } from './strategies/google.strategy';
import { FortyTwoStrategy } from './strategies/forty-two.strategy';

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
              secret: config.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: '3600s' },
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, JwtStrategy, GoogleStrategy, FortyTwoStrategy ],
    controllers: [AuthController],
		exports: [AuthService]
})
export class AuthModule {}
