import io, { Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "shared/models/socket-events";

const socketApp = io(process.env.VUE_APP_BACKEND_SERVER_URI + "/app", {
  autoConnect: false,
  withCredentials: true,
}) as Socket<ServerToClientEvents, ClientToServerEvents>;

declare module '@vue/runtime-core'{
	interface ComponentCustomProperties {
		$socketapp: Socket<ServerToClientEvents, ClientToServerEvents>
	}
}

export default socketApp;
