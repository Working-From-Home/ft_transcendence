import { Socket } from "socket.io";

export interface IPlayer {
	userId: number,
	username: string,
	socket?: Socket,
	score: number,
}