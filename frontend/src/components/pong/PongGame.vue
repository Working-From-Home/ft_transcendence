<template>
	<!-- <div class="row justify-content-center p-4"> -->
	<div class="col-md-10 col-xl-8 m-auto mt-4 p-3 bg-secondary rounded-3">
		<h5>{{ score[0] }} | {{ score[1] }}</h5>
		<h5 v-if="finished">{{ winner }} won the game!</h5>
    <canvas id="canvas" tabindex="0" width="640" height="400"
				@keydown="handleKeydown"
        @keyup="handleKeyup">
		</canvas>
	</div>
	<!-- </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '../ui/Card.vue'
import { IGameState, GameCanvas } from './GameCanvas'


export default defineComponent({
  components: { Card },
	data() {
		return {
			gameCanvas: {} as GameCanvas,
			score: [0, 0],
			finished: false,
			winner: ''
		}
	},
	created() {
		this.$pongSocket.emit("joinGame", this.$route.params.gameId);
	},
	mounted() {
		this.gameCanvas = new GameCanvas('#canvas');
		const gameState = {
			leftPaddle : {x : 20, y: 160},
			rightPaddle : {x : 610, y: 160},
			ball: {x : 315, y: 195},
			score: [0, 0]
		}
		this.gameCanvas.drawGameState(gameState);
		this.$pongSocket.on("gameState", (gameState : IGameState) => {
			this.score = gameState.score;
			this.gameCanvas.drawGameState(gameState);
		});
		this.$pongSocket.on("gameFinish", (winner : string) => {
			console.log(`${winner} won!`);
			this.winner = winner;
			this.finished = true;
		});
	},
	unmounted() {
		this.$pongSocket.off("gameState");
		this.$pongSocket.emit("leaveGame", this.$route.params.gameId);
	},
	methods: {
		handleKeydown(event : KeyboardEvent) {
			if(["ArrowUp","ArrowDown"].indexOf(event.code) > -1) {
        		event.preventDefault();
				let key = event.code;
				this.$pongSocket.volatile.emit("keydown", key);
    		}
		},
		handleKeyup(event : KeyboardEvent) {
			if(["ArrowUp","ArrowDown"].indexOf(event.code) > -1) {
        		event.preventDefault();
				let key = event.code;
				this.$pongSocket.emit("keyup", key);
    		}
		},
	}
})

</script>
 
 <style scoped>
		canvas {
			background: #000000;
			border:1px solid #000000;
			width: 100%
		}
</style>