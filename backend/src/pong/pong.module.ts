import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [AuthModule, UsersModule],
	providers: [PongGateway]
})
export class PongModule {}
