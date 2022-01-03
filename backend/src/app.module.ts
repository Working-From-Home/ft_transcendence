import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Avatar } from './users/entities/avatar.entity';
import { AuthModule } from './auth/auth.module';
import { PongModule } from './pong/pong.module';
import { Stats } from './users/entities/stats.entity';
import { Friendship } from './users/entities/friendship.entity';
import { GameModule } from './game/game.module';
import { Blocked } from './users/entities/blocked.entity';
import { Achievement } from './users/entities/achievement.entity';
import { Channel } from './channels/entities/channel.entity';
import { Message } from './channels/entities/message.entity';
import { UserChannel } from './channels/entities/user-channel.entity';
import { Game } from './game/entities/game.entity';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST'),
          port: config.get<number>('POSTGRES_PORT'),
          username: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          database: config.get('POSTGRES_DATABASE'),
          entities: [
            User, Stats, Avatar, Friendship, Blocked, Achievement,
            Channel, Message, UserChannel,
            Game 
          ],
          // logging: 'all',
          synchronize: true     // shouldn't be used in production: may lose data
        }
      }
    }),
    UsersModule,
    AuthModule,
		PongModule,
		GameModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
