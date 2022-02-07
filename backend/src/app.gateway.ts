import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody,SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';


import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData} from 'shared/models/socket-events'

import { ChatTmpService } from './channels/chat.tmp.service'
import { OnlineService } from './online.service';

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

@WebSocketGateway( { namespace:"/app", cors: { origin: "http://localhost:8080", credentials: true} })
export class AppGateway {

	private logger: Logger = new Logger('AppGAteway');
	@WebSocketServer()
	server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;


	constructor(
		private authService : AuthService,
		private onlineService: OnlineService,
		private chatService : ChatTmpService
	) {}

	async handleConnection(client: AppSocket) {
		const payload = await this.authService.getPayloadFromToken(client.handshake.auth.token);
		if (payload === null)
		{
			this.logger.log('The token probably expired. Deal with it bro.');
			client.emit('error', new UnauthorizedException());
			client.disconnect();
			return
		}
		this.onlineService.addUser(payload.userId);
		client.data.userId = payload.userId
		this.atConnection(client)
		this.logger.log(`User id ${payload.userId} is online. (${this.onlineService.getTotalOnlineUsers()} online users)`);
	}
	
	async handleDisconnect(client: AppSocket) {
		if (client.data.userId) {
			this.onlineService.removeUser(client.data.userId)
			client.broadcast.emit("userDisconnected", client.data.userId);
			this.logger.log(`User id ${client.data.userId} is offline. (${this.onlineService.getTotalOnlineUsers()} online users)`);
		}
		else
			this.logger.log(`Disconnection: http handshake failed for some reason`);
	}
	
	/**
	 * send all data at the newly connected client
	 * - channels of the user, messages, users in each channel he belong...
	 * - Friends requests and updates
	 * - what else ?
	 * Also make it join all of his rooms (like one room by channel, what else ? )
	 */
	private atConnection(client: AppSocket)
	{
		const userId: number = client.data.userId;
		// Online
		client.emit("connectedUsers", this.onlineService.getOnlineUsers());
		client.broadcast.emit("userConnected", userId);
		this.server.emit('numberOfOnlineUsers', this.onlineService.getTotalOnlineUsers())
		// chat
		this.chatService.getChannelsOfUser("1").then( (y) => { 
			client.emit('sendChannels', y);
		})
		// friend requests, and other

	}

	@SubscribeMessage('searchChannel')
	handleEvent(client: AppSocket, title: string) {
		return this.chatService.searchChannelsByTitle(title).then( (x) => { return x })
	}

	@SubscribeMessage('searchChannelsByUser')
	handleEventChannel(client: AppSocket, title: string) {
		return this.chatService.getChannelsOfUser("1").then( (y) => { 
				// console.log(y);
				return y
		}); 
	}
}
