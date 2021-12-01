import { GameObject } from "./GameObject";

export class GameView {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
		//private start: HTMLObjectElement | null;

    constructor(canvasName: string) {
        this.canvas = document.querySelector(canvasName) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
    }

    drawGameObject(object : GameObject) : void {
        // this.context?.beginPath();
        this.context!.fillStyle = "#F8F8FF";
				this.context?.clearRect(0,0, 680, 360);
				this.context?.fillRect(object.pos.x, object.pos.y, object.width, object.height);
        // this.context?.rect(object.pos.x, object.pos.y, object.width, object.height);
        // this.context?.fill();
        // this.context?.closePath();
    }

		clear() {
			this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		setUpCanvasSize() {
			this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
		}
}