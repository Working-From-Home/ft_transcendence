import { Vector } from './types';

export class GameObject {
	constructor(
		private _height: number,
		private _width: number,
		private _pos : Vector
	) {
		this._height = _height;
		this._width = _width;
		this._pos = _pos;
	}

  // Getters
  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get pos(): Vector {
    return this._pos;
  }

	setPos(newPos : Vector) : void {
		this._pos = newPos;
	}
}

