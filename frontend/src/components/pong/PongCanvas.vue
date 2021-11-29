<template>
    <div>
        <h3>this is the canvas</h3>
        <canvas id="canvas" width="640" height="360"></canvas>
				<button id="start">Start</button>
    </div>
</template>



<script lang="ts"> 
import { defineComponent } from "vue"
import { io, Socket } from "socket.io-client"
import { GameView } from "./GameView"
import { GameObject } from "./GameObject";

export default defineComponent({
	data() {
		return {
			socket: {} as Socket,
			gameView: {} as GameView,
			paddle: {} as GameObject
		}
	},
	created() {
		this.socket = io("http://localhost:3000");
		window.addEventListener('keydown', this.move);
	},
	unmounted() {
	window.removeEventListener('keydown', this.move);
},
  mounted() : void {
		this.gameView = new GameView('#canvas');
		this.paddle = new GameObject(60, 15, {x: 10, y: 100});
		this.socket.on("msgToClient", data => {
			console.log(`recv: ${data}`);
		})
		this.socket.on("position", data => {
			this.paddle.setPos(data);
			this.gameView.drawGameObject((this.paddle as any) as GameObject);
		})
		this.socket.emit('msgToServer', "yo le server");
	},
	methods: {
		move(event : KeyboardEvent) {
			if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }

			let cmd = event.code;
			console.log(cmd);
			//this.socket.emit("move", direction);
		}
	}
})
</script>



<style>
    canvas {
        background: #000000;
    }
</style>
