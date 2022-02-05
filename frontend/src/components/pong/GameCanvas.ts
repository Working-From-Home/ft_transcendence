export type Vector = {
  x: number;
  y: number;
};

export interface IGameState {
  leftPaddle : Vector;
  rightPaddle : Vector;
  ball : Vector;
	score : number[]
};

export class GameCanvas {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
		// private paddleHeightRatio : number;
		// private paddleWidthRatio : number;
		//private start: HTMLObjectElement | null;

    constructor(canvasName: string) {
        this.canvas = document.querySelector(canvasName) as HTMLCanvasElement;
				console.log(this.canvas.width);
        this.context = this.canvas.getContext('2d');
				// this.canvas.height = this.canvas.width * 0.625;	
				// this.paddleWidthRatio = 1 / 64;
				// this.paddleHeightRatio = 1 / 5;
    }

    drawGameState(gameState : IGameState) : void {
			// this.context?.beginPath();
			this.context!.fillStyle = "#F0F8FF";
			this.context?.clearRect(0,0, 640, 400);
			this.context?.fillRect(gameState.ball.x, gameState.ball.y, 10, 10);
			this.context?.fillRect(gameState.leftPaddle.x, gameState.leftPaddle.y, 10, 80);
			this.context?.fillRect(gameState.rightPaddle.x, gameState.rightPaddle.y, 10, 80);
			// this.context?.clearRect(0,0, this.canvas.width, this.canvas.height);
			// this.context?.fillRect(gameState.ball.x, gameState.ball.y, ballSize, ballSize);
			// this.context?.fillRect(gameState.leftPaddle.x, gameState.leftPaddle.y, paddleWidth, paddleHeight);
			// this.context?.fillRect(gameState.rightPaddle.x, gameState.rightPaddle.y, paddleWidth, paddleHeight);
			// const paddleHeight = this.paddleHeightRatio * this.canvas.height;
			// const paddleWidth = this.paddleWidthRatio * this.canvas.width;
			// const ballSize = paddleWidth;
    }

		clear() {
			this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		setUpCanvasSize() {
			this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
		}
}