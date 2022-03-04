import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody,SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';

import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData} from 'shared/models/socket-events'

import { ChatService } from './channels/services/chat.service'
import { OnlineService } from './online.service';

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

@WebSocketGateway( { namespace:"/app", cors: { origin: true, credentials: true} })
export class AppGateway {

	private logger: Logger = new Logger('AppGAteway');
	@WebSocketServer()
	server: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

	constructor(
		private authService : AuthService,
		private onlineService: OnlineService,
		private chatService : ChatService
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
		this.onlineService.addUser(payload.sub);
		client.data.userId = payload.sub
		this.atConnection(client)
		this.logger.log(`User id ${payload.sub} is online. (${this.onlineService.getTotalOnlineUsers()} online users)`);
	}
	
	async handleDisconnect(client: AppSocket) {
		if (client.data.userId) {
			this.onlineService.removeUser(client.data.userId)
			this.server.emit("connectedUsers", this.onlineService.getOnlineUsers())
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
		this.server.emit("connectedUsers", this.onlineService.getOnlineUsers());
		this.server.emit('numberOfOnlineUsers', this.onlineService.getTotalOnlineUsers())
		client.join("user:" + userId);
		// chat
		this.chatService.getChannelsOfUser(userId).then( (y) => {
			for (const obj of y){
				client.join("channel:" + obj["roomId"]);
			}
			client.emit('sendChannels', y);
		})
		// friend requests, and other

	}

	@SubscribeMessage('searchChannel')
	handleEvent(client: AppSocket, title: string) {
		return this.chatService.searchChannelsByTitle(title).then( (x) => { return x })
	}

	@SubscribeMessage('searchChannelsByUser')
	handleEventChannel(client: AppSocket, userId: number) {
		return this.chatService.getChannelsOfUser(userId).then( (y) => { return y }); 
	}
	@SubscribeMessage('sendUserOfChannels')
	handleEventUsersInChannel(client: AppSocket, channelId: number) {
		return this.chatService.getUsersOfChannel(channelId).then( (y) => { 
				return y
		}); 
	}
	@SubscribeMessage('sendMessagesOfChannels')
	handleEventMessagesInChannel(client: AppSocket, channelId: number) {
		return this.chatService.getMessagesOfChannel(channelId).then( (y) => {
				return y
		}); 
	}
}
