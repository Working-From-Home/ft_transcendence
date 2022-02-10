import { Socket, Server } from "socket.io";
import { clearInterval } from 'timers';
import { IGameState } from "./types";
import { GameObject } from "./GameObject";
import { checkPaddleWall, checkBallCollision } from "./collision";
import { UsersService } from 'src/users/services/users.service';
import { IPlayer } from "./IPlayer";
import { IEndCallback } from "./IEndCallback";
import { IGameSettings } from "./IGameRequest";

//width: 640, height: 400.

export class PongGame {
	gameId: string;
	private _leftPaddle : GameObject;
	private _rightPaddle : GameObject;
	private _ball : GameObject;
	private _ballXspeed : number;
	private _players : {left : IPlayer, right : IPlayer};
	private _isRunning = false;
	private _server : Server;
	private _score : number[];
	private _maxScore : number;

	constructor(
			server : Server,
			players : {left: IPlayer, right: IPlayer}, 
			gameSettings : IGameSettings = {speed: 6, paddleSize: 80, score: 5},
		)
	{
		this._server = server;
		this._players = players;
		this.gameId = `${players.left.userId}vs${players.right.userId}`;
		this._leftPaddle = new GameObject(10, gameSettings.paddleSize, {x : 20, y: 160}, {x : 0, y : 0});
		this._rightPaddle = new GameObject(10, gameSettings.paddleSize, {x : 610, y: 160}, {x : 0, y : 0});
		this._ball = new GameObject(10, 10, {x : 315, y: 195}, {x : 2, y : 1});
		this._score = [0, 0];
		this._ballXspeed = gameSettings.speed;
		this._maxScore = gameSettings.score;
	}
	
	join(socket : Socket) : void {
		socket.join(this.gameId);

		const userId = socket.data.userId;
		if (userId != this._players.left.userId && userId != this._players.right.userId)
			return ;

		if (userId == this._players.left.userId)
			this._players.left.socket = socket;
		else
			this._players.right.socket = socket;
		
		socket.on('keydown', (key) => {
			this.handleKeydown(socket, key);
		});
		socket.on('keyup', (key) => {
			this.handleKeyup(socket, key);
		});
	}

	private handleKeydown(socket : Socket, key : string) : void {
		if (key === "ArrowDown") {
			if (socket.data.userId === this._players.left.userId)
				this._leftPaddle.speed = {x : 0, y : 5};
			else
				this._rightPaddle.speed = {x : 0, y : 5};
		}
		else if (key === "ArrowUp") {
			if (socket.data.userId === this._players.left.userId)
				this._leftPaddle.speed = {x : 0, y : -5};
			else
				this._rightPaddle.speed = {x : 0, y : -5};
		}
	}

	private handleKeyup(socket : Socket, key : string) : void {
		if (key === "ArrowDown" && this._leftPaddle.speed.y !== -5) {
			if (socket.data.userId === this._players.left.userId)
				this._leftPaddle.speed = {x : 0, y : 0};
			else
				this._rightPaddle.speed = {x : 0, y : 0};
		}
		else if (key === "ArrowUp" && this._leftPaddle.speed.y !== 5) {
			if (socket.data.userId === this._players.left.userId)
				this._leftPaddle.speed = {x : 0, y : 0};
			else
				this._rightPaddle.speed = {x : 0, y : 0};
		}
	}

	_startGame(callback: IEndCallback) {
		setTimeout(() => {
			this._gameLoop(callback);
		}, 5000);
	}

	private _gameLoop(callback: IEndCallback) : void {
		this._isRunning = true;
		this._sendGameState();
		const intervalId = setInterval(() => {
			checkBallCollision(this._ball, this._leftPaddle, this._rightPaddle);
			this._checkIfScored();
			this._ball.move();
			this._movePaddles();
			this._sendGameState();
			if (this._isRunning === false) {
				clearInterval(intervalId);
				this._finishGame(callback);
			}
		}, 16);
	}
	
	private _checkIfScored() {
		if (this._ball.pos.x < 0) {
			this._score[1] += 1;
			if (this._score[1] >= 5)
				this._isRunning = false;
		}
		else if (this._ball.pos.x > 640 - this._ball.width) {
			this._score[0] += 1;
			if (this._score[0] >= 5)
				this._isRunning = false;
		}
		else {
			return ;
		}
		this._ball.pos = {x : 315, y: 195};
		this._ball.speed = {x : 2, y: 1};
	}

	private _movePaddles() {
		if (checkPaddleWall(this._leftPaddle))
			this._leftPaddle.move();
		if (checkPaddleWall(this._rightPaddle))
			this._rightPaddle.move();
	}

	private _sendGameState() {
		let gameState : IGameState = {
			leftPaddle : this._leftPaddle.pos,
			rightPaddle : this._rightPaddle.pos,
			ball : this._ball.pos,
			score: this._score
		}
		this._server.volatile.to(`${this.gameId}`).emit("gameState", gameState);
	}

	private _finishGame(callback: IEndCallback) {
		let winner : string;

		if (this._score[0] >= 5)
			winner = this._players.left.username;
		else
			winner = this._players.right.username;
		console.log("gameFinished!");
		this._server.to(`${this.gameId}`).emit("gameFinish", winner);
		callback(this.gameId);
	}
}