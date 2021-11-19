export class Canvas {
    canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    constructor(canvasName: string) {
        this.canvas = document.querySelector(canvasName) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');
    }

    drawSomething() : void {
        this.context?.beginPath();
        this.context?.rect(20, 40, 50, 50);
        this.context!.fillStyle = "#FF0000";
        this.context?.fill();
        this.context?.closePath();
    }
}