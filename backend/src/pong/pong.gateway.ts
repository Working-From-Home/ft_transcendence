import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongGame } from './classAndTypes/PongGame';
import { IPlayer } from './classAndTypes/IPlayer';
import { GameQueue } from './classAndTypes/GameQueue';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';

@WebSocketGateway( { namespace: "/pong", cors: { origin: "http://localhost:8080"} })
export class PongGateway {

	private logger: Logger = new Logger('PongGateway');
	@WebSocketServer() server: Server;
	private games : Map<string, PongGame>;
	private gameQueue : GameQueue;

	constructor(
		private authService : AuthService,
		private usersService : UsersService
	) {
		this.gameQueue = new GameQueue;
		this.games = new Map<string, PongGame>();
	}

	afterInit(server: Server) {
		this.logger.log('Initialized!');
		//this.game = new PongGame(this.server);
	}

	async handleConnection(socket: Socket) {
		this.logger.log('new connexion');
		try {
			const decodedToken = await this.authService.verifyJwt(socket.handshake.auth.token);
			const userId = decodedToken.sub;
			socket.data.userId = userId;
			this.logger.log(`userId: ${userId}`);
		}
		catch {
			this.logger.log("fail identify");
			return this.disconnect(socket);
		}
	}

	private disconnect(socket: Socket) {
		socket.emit('Error', new UnauthorizedException());
		socket.disconnect();
	}
 
	handleDisconnect(socket: Socket) {
		this.gameQueue.remove(socket);
		this.logger.log('disconnection!');
	}

	@SubscribeMessage('joinMatchmaking')
	joinMatchmaking(@ConnectedSocket() socket : Socket) {
		this.logger.log(`id: ${socket.data.userId} join matchmaking`);
		this.gameQueue.add(socket);
		this.checkGameQueue();
	}

	@SubscribeMessage('leaveMatchmaking')
	leaveMatchmaking(@ConnectedSocket() socket : Socket) {
		this.logger.log(`id: ${socket.data.userId} leave matchmaking`);
		this.gameQueue.remove(socket);
	}

	@SubscribeMessage('joinGame')
	joinGame(@MessageBody() gameId : string, @ConnectedSocket() socket : Socket) {
		const game = this.games.get(gameId);
		if (!game) {
			socket.emit("Error", "No game corresponding to this Id");
			return ;
		}
		game.join(socket);
	}

	async checkGameQueue() {
		let playersSockets : Socket[];

		if (this.gameQueue.size() < 2)
			return ;
		else {
			playersSockets = this.gameQueue.pop2();
			const gameId = await this.initPongGame([playersSockets[0].data.userId, playersSockets[1].data.userId])
			playersSockets[0].emit("matchFound", gameId);
			playersSockets[1].emit("matchFound", gameId);
		}
	}

	async initPongGame(userIds : number[]) : Promise<string> {
		const leftUser = await this.usersService.findById(userIds[0]);
		const rightUser = await this.usersService.findById(userIds[1]);

		let leftPlayer : IPlayer = {userId : leftUser.id, username : leftUser.username, score : 0};
		let rightPlayer : IPlayer = {userId : rightUser.id, username : rightUser.username, score : 0};
		let game = new PongGame(this.server, {left: leftPlayer, right: rightPlayer});
		this.games.set(game.gameId, game);
		game._startGame();
		return game.gameId;
	}
}
