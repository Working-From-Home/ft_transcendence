import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway( { cors: { origin: "http://localhost:8080"} })
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	private logger: Logger = new Logger('AppGAteway');

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
		client.emit('position', {x : 5 , y : 150});
		this.logger.log(`client message: ${text}`);
    return {event: 'msgToClient', data: 'Hello world!'};
  }

	@SubscribeMessage('move')
	handleMove(@MessageBody() data : string, @ConnectedSocket() client: Socket) {
		this.logger.log(`client message: ${data}`);
	}
}
