import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GameModule } from 'src/game/game.module';

@Module({
	imports: [AuthModule, UsersModule, GameModule],
	providers: [PongGateway]
})
export class PongModule {}
