import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody,SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/services/users.service'
import { User } from './users/entities/user.entity';

type ConnectedUser = {
	id: number;
	username: string;
//	socket_ids?: string[];
};

@WebSocketGateway( { namespace:"/app", cors: { origin: "http://localhost:8080", credentials: true} })
export class AppGateway {

	private logger: Logger = new Logger('AppGAteway');
	private connectedUsers: ConnectedUser[] = [];
	@WebSocketServer() server: Server;

	constructor(
		private authService : AuthService,
		private usersService : UsersService
	) {}


	async handleConnection(socket: Socket) {
		this.logger.log('new connexion!');

		try {
			const decodedToken = await this.authService.verifyJwt(socket.handshake.auth.token);
			const userId = decodedToken.sub;
			const user : User = await this.usersService.findById(userId);
			if (!user) {
				return this.disconnect(socket);
			} else {
				socket.data.user = user;
			}
		}
		catch {
			return this.disconnect(socket);
		}
		this.connectedUsers.push({id : socket.data.user.id, username : socket.data.user.username});
		socket.emit("connectedUsers", this.connectedUsers);
		socket.broadcast.emit("userConnected", {id : socket.data.user.id, username : socket.data.user.username});
		console.log(this.connectedUsers);
	}

	private disconnect(socket: Socket) {
		socket.emit('Error', new UnauthorizedException());
		socket.disconnect();
	}

	handleDisconnect(socket: Socket) {
		this.logger.log('disconnection!');
		const userId = socket.data.user.id;
		this.connectedUsers = this.connectedUsers.filter((u) => u.id !== userId);
		socket.emit("userDisconnected", userId);
		socket.disconnect();
		console.log(this.connectedUsers);
	}


}
