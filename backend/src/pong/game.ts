import { Socket, Server } from "socket.io";
import { clearInterval } from 'timers';

export class PongGame {
//	private gameId: number;
	private _leftPaddle = {x : 5, y : 150};
	private _moveUp = false;
	private _moveDown = false;
	private _rightPaddle : any;
	private _ball : any;
	private _client : Socket;
	private _isRunning = false;
//	private _guestClient : Socket;
	private _server : Server;

	constructor(server : Server) {
		this._server = server;
	}

	start() {
		this._gameLoop();
	}

	stop() {
		this._isRunning = false;
	}

	handleKeydown(key : string) {
		if (key === "ArrowDown")
			this._moveDown = true;
		else if (key === "ArrowUp")
			this._moveUp = true;
	}

	handleKeyup(key : string) {
		if (key === "ArrowDown")
			this._moveDown = false;
		else if (key === "ArrowUp")
			this._moveUp = false;
	}

	setClient(client : Socket) {
		this._client = client; 
	}

	private _gameLoop() {
		this._isRunning = true;
		this._server.emit("position", this._leftPaddle);
		const intervalId = setInterval(() => {
			if (this._moveUp)
				this._leftPaddle.y -= 5;
			if (this._moveDown)
				this._leftPaddle.y += 5;
			this._server.emit("position", this._leftPaddle);
			if (this._isRunning === false)
				clearInterval(intervalId);
		}, 16);
	}
}