import { Socket, Server } from "socket.io";
import { clearInterval } from 'timers';
import { GameState } from "./classAndTypes/types";
import { GameObject } from "./classAndTypes/GameObject";
import { checkPaddleWall, checkBallCollision } from "./collision";

export class PongGame {
//	private gameId: number;
	private _leftPaddle : GameObject;
	private _rightPaddle : GameObject;
	private _ball : GameObject;
	private _client : Socket;
	private _isRunning = false;
//	private _guestClient : Socket;
	private _server : Server;

	constructor(server : Server) {
		this._server = server;
		this._leftPaddle = new GameObject(10, 80, {x : 20, y: 160}, {x : 0, y : 0});
		this._rightPaddle = new GameObject(10, 80, {x : 610, y: 160}, {x : 0, y : 0});
		this._ball = new GameObject(10, 10, {x : 315, y: 195}, {x : 6, y : 1});
	}

	start() : void {
		this._gameLoop();
	}

	stop() : void {
		this._isRunning = false;
		this._ball.pos = {x: 315, y: 195};
	}

	handleKeydown(key : string) : void {
		if (key === "ArrowDown") {
			this._leftPaddle.speed = {x : 0, y : 5};
			this._rightPaddle.speed = {x : 0, y : 5};
		}
		else if (key === "ArrowUp") {
			this._leftPaddle.speed = {x : 0, y : -5};
			this._rightPaddle.speed = {x : 0, y : -5};
		}
	}

	handleKeyup(key : string) : void {
		if (key === "ArrowDown" && this._leftPaddle.speed.y !== -5) {
			this._leftPaddle.speed = {x : 0, y : 0};
			this._rightPaddle.speed = {x : 0, y : 0};
		}
		else if (key === "ArrowUp" && this._leftPaddle.speed.y !== 5) {
			this._leftPaddle.speed = {x : 0, y : 0};
			this._rightPaddle.speed = {x : 0, y : 0};
		}
	}

	setClient(client : Socket) : void {
		this._client = client; 
	}

	private _gameLoop() : void {
		this._isRunning = true;
		this._sendGameState();
		const intervalId = setInterval(() => {
			checkBallCollision(this._ball, this._leftPaddle, this._rightPaddle);
			this._ball.move();
			this._movePaddles();
			this._sendGameState();
			if (this._isRunning === false)
				clearInterval(intervalId);
		}, 16);
	}

	private _movePaddles() {
		if (checkPaddleWall(this._leftPaddle))
			this._leftPaddle.move();
		if (checkPaddleWall(this._rightPaddle))
			this._rightPaddle.move();
	}


	private _sendGameState() : void {
		let gameState : GameState = {
			leftPaddle : this._leftPaddle.pos,
			rightPaddle : this._rightPaddle.pos,
			ball : this._ball.pos
		}
		this._server.emit("gameState", gameState);
	}
}