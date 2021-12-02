import { Vector } from "./types";

export class GameObject {

	constructor(
		private _width : number,
		private _height : number,
		private _pos : Vector,
		private _speed : Vector,
	) {
		this._width = _width;
		this._height = _height;
		this._pos = _pos;
		this._speed = _speed;
	}

	get width(): number {
		return this._width;
	}
	
	get height(): number {
		return this._height;
	}

	get pos() : Vector {
		return this._pos;
	}

	set pos(pos : Vector) {
		this._pos = pos;
	}

	get speed() : Vector {
		return this._speed;
	}

	set speed(speed : Vector) {
		this._speed = speed;
	}

	changeYDirection(): void {
		this._speed.y = -this._speed.y;
	}
	
	changeXDirection(): void {
		this._speed.x = -this._speed.x;
	}

	move() : void {
		this._pos.x += this._speed.x;
		this._pos.y += this._speed.y;
	}
}