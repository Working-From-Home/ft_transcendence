<template>
		<card>
		<h5>{{ score[0] }} | {{ score[1] }}</h5>
		<h5 v-if="finished">{{ winner }} won the game!</h5>
    <canvas id="canvas" tabindex="0" width="640" height="400"
				@keydown="handleKeydown"
        @keyup="handleKeyup">
		</canvas>
		</card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { pongSocket } from '../../views/Pong.vue'
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
		pongSocket.emit("joinGame", this.$route.params.gameId);
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
		pongSocket.on("gameState", gameState => {
			this.score = gameState.score;
			this.gameCanvas.drawGameState(gameState);
		});
		pongSocket.on("gameFinish", winner => {
			console.log(`${winner} won!`);
			this.winner = winner;
			this.finished = true;
		});
	},
	unmounted() {
		pongSocket.off("gameState");
		pongSocket.emit("leaveGame", this.$route.params.gameId);
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
			width: 100%
		}
</style>