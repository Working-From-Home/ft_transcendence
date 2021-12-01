<template>
    <div>
        <h3>this is the canvas</h3>
				<div class="canvas-container">
        	<canvas id="canvas" width="640" height="360"></canvas>
				</div>
				<button id="start" @click="startGame">Start</button>
				<button id="stop" @click="stopGame">Stop</button>
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
		this.socket = io("http://localhost:3000/pong");
		window.addEventListener('keydown', this.handleKeydown);
		document.addEventListener('keyup', this.handleKeyup);
		//window.addEventListener('resize', this.handleResize);
	},
	unmounted() {
	window.removeEventListener('keydown', this.handleKeydown);
	document.addEventListener('keyup', this.handleKeyup);
},
  mounted() : void {
		this.gameView = new GameView('#canvas');
		this.paddle = new GameObject(60, 15, {x: 10, y: 100});
		this.socket.on("position", data => {
			this.paddle.setPos(data);
			this.gameView.drawGameObject((this.paddle as any) as GameObject);
		})
		this.socket.emit('msgToServer', "yo le server");
	},
	methods: {
		handleKeydown(event : KeyboardEvent) {
			if(["ArrowUp","ArrowDown"].indexOf(event.code) > -1) {
        event.preventDefault();
				let key = event.code;
				this.socket.emit("keydown", key);
    	}
		},
		handleKeyup(event : KeyboardEvent) {
			if(["ArrowUp","ArrowDown"].indexOf(event.code) > -1) {
        event.preventDefault();
				let key = event.code;
				this.socket.emit("keyup", key);
    	}
		},
		handleResize() {
			this.gameView.clear();
    	this.gameView.setUpCanvasSize();
    	this.gameView.drawGameObject((this.paddle as any) as GameObject);
		},
		startGame() {
			this.socket.emit("start");
		},
		stopGame() {
			this.socket.emit("stop");
		}
	}
})
</script>



<style>
    canvas {
        background: #000000;
    }
		
		.canvas-container {
    width: 100%;
  	}
</style>
