import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { clearInterval } from 'timers';

let position = {x : 5, y : 150};
let moveUp = false;
let moveDown = false;
let gameRunning = false;

@WebSocketGateway( { namespace: "/pong", cors: { origin: "http://localhost:8080"} })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private logger: Logger = new Logger('AppGAteway');
	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		this.logger.log('Initialize!');
	}

	handleConnection(client: Socket) {
		this.logger.log('new connexion');
	}

	handleDisconnect(client: Socket) {
		this.logger.log('disconnection!');
	}

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
		//client.emit('position', position);
		this.logger.log(`client message: ${text}`);
    return {event: 'msgToClient', data: 'Hello world!'};
  }

	@SubscribeMessage('keydown')
	handleKeydown(@MessageBody() data : string, @ConnectedSocket() client: Socket) {
		this.logger.log(`keydown: ${data}`);
		if (data === "ArrowDown")
			moveDown = true;
		else if (data === "ArrowUp")
			moveUp = true;
	}

	@SubscribeMessage('keyup')
	handleKeyup(@MessageBody() data : string, @ConnectedSocket() client: Socket) {
		this.logger.log(`keyup: ${data}`);
		if (data === "ArrowDown")
			moveDown = false;
		else if (data === "ArrowUp")
			moveUp = false;
	}

	@SubscribeMessage('start')
	startGame() {
		this.logger.log("Game started!");
		gameRunning = true;
		const intervalId = setInterval(() => {
			if (moveUp)
				position.y -= 5;
			if (moveDown)
				position.y += 5;
			this.server.emit("position", position);
			if (gameRunning === false)
				clearInterval(intervalId);
		}, 16);
	}
	
	@SubscribeMessage('stop')
	stopGame() {
		this.logger.log("Game stopped!");
		gameRunning = false;
	}
}
