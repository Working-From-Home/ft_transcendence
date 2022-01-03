import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';
import { GameController } from './controllers/game.controller';

@Module({
    providers: [
        GameService
    ],
    controllers: [
        GameController
    ]
})
export class GameModule {}
