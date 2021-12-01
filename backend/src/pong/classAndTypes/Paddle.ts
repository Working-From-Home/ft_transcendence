import { Vector } from "./types";

export class Paddle {
	private _pos : Vector;
	moveUp = false;
	moveDown = false;

	constructor(pos : Vector ) {
		this._pos = pos;
	}

	get pos() {
		return this._pos;
	}
}