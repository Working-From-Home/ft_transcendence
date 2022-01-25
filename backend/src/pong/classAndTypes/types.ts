export type Vector = {
  x: number;
  y: number;
};

export interface IGameState {
  leftPaddle : Vector;
  rightPaddle : Vector;
  ball : Vector;
	score : number[];
};