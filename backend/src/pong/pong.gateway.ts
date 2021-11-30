import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PongGame } from './game'

@WebSocketGateway( { namespace: "/pong", cors: { origin: "http://localhost:8080"} })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private logger: Logger = new Logger('AppGAteway');
	@WebSocketServer() server: Server;
	private game : PongGame;

	afterInit(server: Server) {
		this.logger.log('Initialize!');
		this.game = new PongGame(this.server);
	}

	handleConnection(client: Socket) {
		this.logger.log('new connexion');
	}

	handleDisconnect(client: Socket) {
		this.logger.log('disconnection!');
	}

	@SubscribeMessage('keydown')
	handleKeydown(@MessageBody() data : string, @ConnectedSocket() client: Socket) {
		this.logger.log(`keydown: ${data}`);
		this.game.handleKeydown(data);
	}

	@SubscribeMessage('keyup')
	handleKeyup(@MessageBody() data : string, @ConnectedSocket() client: Socket) {
		this.logger.log(`keyup: ${data}`);
		this.game.handleKeyup(data);
	}

	@SubscribeMessage('start')
	startGame(client: Socket) {
		this.logger.log("Game started!");
		this.game.setClient(client);
		this.game.start();
	}
	
	@SubscribeMessage('stop')
	stopGame() {
		this.logger.log("Game stopped!");
		this.game.stop();
	}
}
