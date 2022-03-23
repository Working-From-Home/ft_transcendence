import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';
import { GameController } from './controllers/game.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
		imports: [
			UsersModule
		],
    providers: [
        GameService
    ],
    controllers: [
        GameController
    ],
		exports: [
			GameService
		]
})
export class GameModule {}
