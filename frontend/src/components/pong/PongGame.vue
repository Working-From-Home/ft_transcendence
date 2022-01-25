<template>
	<card>
		<h3>PongGame {{ $route.params.gameId }}</h3>
		<h5>{{ score[0] }} | {{ score[1] }}</h5>
		<h5 v-if="finished">{{ winner }} won the game!</h5>
		<div class="canvas-container">
      <canvas id="canvas" width="640" height="400" tabindex="0"
					@keydown="handleKeydown"
          @keyup="handleKeyup"></canvas>
		</div>
	</card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { pongSocket } from '../../views/Pong.vue'
import { IGameState, GameCanvas } from './GameCanvas'


export default defineComponent({
	data() {
		return {
			gameCanvas: {} as GameCanvas,
			score: [0, 0],
			finished: false,
			winner: ''
		}
	},
	created() {
		pongSocket.emit("joinGame", this.$route.params.gameId);
	},
	mounted() {
		this.gameCanvas = new GameCanvas('#canvas');
		pongSocket.on("gameState", gameState => {
			this.score = gameState.score;
			this.gameCanvas.drawGameState(gameState);
		});
		pongSocket.on("gameFinish", winner => {
			console.log(`${winner} won!`);
			this.winner = winner;
			this.finished = true;
		})
	},
	unmounted() {
	pongSocket.off("gameState");
	},
	methods: {
		handleKeydown(event : KeyboardEvent) {
			if(["ArrowUp","ArrowDown"].indexOf(event.code) > -1) {
        		event.preventDefault();
				let key = event.code;
				pongSocket.volatile.emit("keydown", key);
    		}
		},
		handleKeyup(event : KeyboardEvent) {
			if(["ArrowUp","ArrowDown"].indexOf(event.code) > -1) {
        		event.preventDefault();
				let key = event.code;
				pongSocket.emit("keyup", key);
    		}
		},
	}
})

</script>
 
 <style scoped>
		canvas {
			background: #000000;
			border:1px solid #000000;
		}
		.canvas-container {
			width: 100%;
		}
</style>