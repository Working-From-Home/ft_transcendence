import { Socket }  from "socket.io-client";

declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		$pongSocket : Socket;
	}
}