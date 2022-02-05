<template>
	<div>
		<div class="col-md-10 p-4 m-auto mt-4 mb-4 bg-info bg-opacity-75 rounded-3">
			<h3 class="display-6 fw-bold">Welcome to the pong part of the app!</h3>
			<!-- <button @click="sendGameRequest(10)">request user 10</button> -->
			<p class="m-auto mt-4 col-md-8 fs-4">
				Pong is one of the first computer games ever created,
				this simple "tennis like" game features two paddles and a ball,
				the goal is to defeat your opponent by being the first one to gain 5 points,
				a player gets a point once the opponent misses a ball.
			</p>
		</div>
		<div class="col-md-10 p-4 m-auto bg-success rounded-3">
			<p class="m-auto col-md-8 fs-4">
				Find an opponent to play with:
			</p>
			<pong-matchmaking />
		</div>
		<teleport to="#modals">
			<div v-if="modal1" class="pong-modal">
				<h1>Modal #1</h1>
			</div>
		</teleport>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { pongSocket } from '../../views/Pong.vue'
import BaseButton from '../ui/BaseButton.vue'
import PongMatchmaking from './PongMatchmaking.vue'

export default defineComponent({
  components: { BaseButton, PongMatchmaking },
	data() {
		return {
			modal1 : false
		}
	},
	methods: {
		sendGameRequest(guestId : number) {
			console.log("send request");
			pongSocket.emit("gameRequest", guestId);
			pongSocket.on("matchFound", gameId => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
		},
	}
})

</script>
 
 <style scoped>
 .pong-modal {
	 position: absolute;
	 top: 50%;
	 left: 50%;
	 transform: translate(-50%, -50%);
	 height: 300px;
	 width: 400px;
	 background: gray;
	 text-align: center;
 }
 
</style>