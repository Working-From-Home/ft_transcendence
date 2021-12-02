import { Vector } from "./types";

export interface GameState {
  leftPaddle : Vector;
  rightPaddle : Vector;
  ball : Vector;
};

export class GameView {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
		//private start: HTMLObjectElement | null;

    constructor(canvasName: string) {
        this.canvas = document.querySelector(canvasName) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
    }

    drawGameState(gameState : GameState) : void {
        // this.context?.beginPath();
        this.context!.fillStyle = "#F0F8FF";
				this.context?.clearRect(0,0, 640, 400);
				this.context?.fillRect(gameState.ball.x, gameState.ball.y, 10, 10);
        this.context?.fillRect(gameState.leftPaddle.x, gameState.leftPaddle.y, 10, 80);
        this.context?.fillRect(gameState.rightPaddle.x, gameState.rightPaddle.y, 10, 80);
    }

		clear() {
			this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		setUpCanvasSize() {
			this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
		}
}