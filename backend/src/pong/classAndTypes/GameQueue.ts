import { Socket } from "socket.io";

export class GameQueue {
	private queue : Array<Socket>;

	constructor() {
		this.queue = [];
	}

	public add(socket : Socket) : void {
		if (this.queue.includes(socket))
			return ;
		this.queue.push(socket);
	}

	public remove(socket : Socket) : void {
		const index = this.queue.indexOf(socket);
		if (index > -1) {
			this.queue.splice(index, 1);
		}
	}

	public pop2() : Socket[] {
		return [this.queue.shift(), this.queue.shift()];
	}

	public size() : number {
		return this.queue.length;
	}
}