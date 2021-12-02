export type Vector = {
  x: number;
  y: number;
};

export type GameState = {
  leftPaddle : Vector;
  rightPaddle : Vector;
  ball : Vector;
};