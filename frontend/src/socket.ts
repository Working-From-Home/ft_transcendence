import io, { Socket }  from "socket.io-client";
import { useStore } from 'vuex';
export { socket, initSocket };

let socket: Socket;
const URL = "http://localhost:3000/app";

function initSocket(token : string, userId: string) : void {
	socket = io(URL,{
		withCredentials: true,
		auth: { token: `${token}`}
	});

	socket.on("connect_error", (err) => {
		console.log(`socket connexion error: ${err}`);
  	});

	//console.log('connectedUsers 2 :', args);
  
}
