import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongGame } from './classAndTypes/PongGame';
import { IPlayer } from './classAndTypes/IPlayer';
import { GameQueue } from './classAndTypes/GameQueue';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/entities/user.entity';
import { IGameSettings, IGameRequest } from './classAndTypes/IGameRequest';

@WebSocketGateway( { namespace: "/pong", cors: { origin: "http://localhost:8080"} })
export class PongGateway {

	private logger: Logger = new Logger('PongGateway');
	@WebSocketServer() server: Server;
	private games : Map<string, PongGame>;
	private gameQueue : GameQueue;
	private gameRequests : Map<string, IGameRequest>;
	private inGameUsers : number[];

	constructor(
		private authService : AuthService,
		private usersService : UsersService
	) {
		this.gameQueue = new GameQueue;
		this.games = new Map<string, PongGame>();
		this.gameRequests = new Map<string, IGameRequest>();
		this.inGameUsers = [];
	}

	/*___Connexion/disconnection events:_____*/

	async handleConnection(socket: Socket) {
		this.logger.log('new connexion');
		try {
			const decodedToken = await this.authService.verifyJwt(socket.handshake.auth.token);
			const userId = decodedToken.sub;
			socket.data.userId = userId;
			socket.join(userId.toString());
			this.logger.log(`userId: ${userId} is connected!`);
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

/*________Matchmaking Events: ____________*/

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

/*______Joining Game Events:_____________*/

	@SubscribeMessage('joinGame')
	joinGame(@MessageBody() gameId : string, @ConnectedSocket() socket : Socket) {
		const game = this.games.get(gameId);
		if (!game) {
			socket.emit("Error", "No game corresponding to this Id");
			return ;
		}
		game.join(socket);
	}

	@SubscribeMessage('leaveGame')
	leaveGame(@MessageBody() gameId : string, @ConnectedSocket() socket : Socket) {
		socket.leave(gameId);
	}

/*_______Private Game Requests Events:____*/

	@SubscribeMessage('gameRequest')
	createGameRequest(@MessageBody() body : {guestId : number, gameSettings : IGameSettings},
		@ConnectedSocket() socket : Socket) {
		const hostId = socket.data.userId;
		if (hostId == body.guestId)
			return ;

		const requestId = `${hostId}to${body.guestId}`;
		this.gameRequests.set(
				requestId,
				{
					hostId: hostId,
					guestId: body.guestId,
					gameSettings: body.gameSettings
				});
		this.server.to(body.guestId.toString()).emit("gameRequest", requestId);

		this.logger.log(body);
		this.logger.log(`got request: ${requestId}`);
		return requestId;
	}

	@SubscribeMessage("cancelRequest")
	cancelGameRequest(@MessageBody() requestId : string, @ConnectedSocket() socket : Socket) {
		const gameRequest = this.gameRequests.get(requestId);
		if (!gameRequest || socket.data.userId != gameRequest.hostId)
			return ;
		socket.to(gameRequest.guestId.toString()).emit("requestCanceled");
		this.gameRequests.delete(requestId);
	}

	@SubscribeMessage('gameRequestAnswer')
	async handleAnswer(@MessageBody() body : {requestId : string, accepted : boolean}, @ConnectedSocket() socket : Socket) {
		const gameRequest = this.gameRequests.get(body.requestId);
		this.logger.log(`got request answer!`);
		if (!gameRequest || socket.data.userId != gameRequest.guestId)
			return ;
		if (body.accepted) {
			const gameId = await this.createPongGame([gameRequest.hostId, gameRequest.guestId], gameRequest.gameSettings);
			socket.emit("matchFound", gameId);
			socket.to(gameRequest.hostId.toString()).emit("matchFound", gameId);
		}
		socket.to(gameRequest.hostId.toString()).emit("requestAnswer", body.accepted);
		this.gameRequests.delete(body.requestId);
	}

	/*____other events:____________________*/

	@SubscribeMessage("getGameId")
	async sendGameId(@MessageBody() id : number, @ConnectedSocket() socket : Socket) {
		this.logger.log(`get game of user id: ${id}`);
		for (let [key, value] of this.games) {
			if (value.isPlayer(id)) {
				this.logger.log(`returned game id: ${key}`)
				return (key);
			}
		}
		this.logger.log("returned null");
		return ("");
	}

	/*____Helper functions:________________*/

	private async checkGameQueue() {
		let playersSockets : Socket[];

		if (this.gameQueue.size() < 2)
			return ;
		else {
			playersSockets = this.gameQueue.pop2();
			const gameId = await this.createPongGame([playersSockets[0].data.userId, playersSockets[1].data.userId])
			playersSockets[0].emit("matchFound", gameId);
			playersSockets[1].emit("matchFound", gameId);
		}
	}

	private async createPongGame(userIds : number[], gameSettings? : IGameSettings) : Promise<string> {
		const leftUser = await this.usersService.findById(userIds[0]);
		const rightUser = await this.usersService.findById(userIds[1]);

		let leftPlayer : IPlayer = {userId : leftUser.id, username : leftUser.username, score : 0};
		let rightPlayer : IPlayer = {userId : rightUser.id, username : rightUser.username, score : 0};
		let game = new PongGame(this.server, {left: leftPlayer, right: rightPlayer}, gameSettings);
		this.games.set(game.gameId, game);
		this.addToInGame(userIds);
		game._startGame((gameId : string) => {
			this.games.delete(gameId);
			this.removeFromInGame(userIds);
		});
		return game.gameId;
	}

	private	addToInGame(userIds : number[]) {
		this.inGameUsers.push(userIds[0]);
		this.inGameUsers.push(userIds[1]);
		this.server.emit("inGameUsers", this.inGameUsers);
	}

	private removeFromInGame(userIds : number[]) {
		this.inGameUsers = this.inGameUsers.filter((id) => (id !== userIds[0] && id !== userIds[1]));
		this.server.emit("inGameUsers", this.inGameUsers);
	}
}


