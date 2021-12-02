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
import { RankController } from './rank/rank.controller';
import { Stats } from './users/entities/stats.entity';

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
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [Avatar, User, Stats],
          synchronize: true     // shouldn't be used in production: may lose data
        }
      }
    }),
    UsersModule,
    AuthModule,
		PongModule
  ],
  controllers: [AppController, RankController],
  providers: [AppService],
})
export class AppModule {}
