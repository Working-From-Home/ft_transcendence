<template>
	<teleport to="#modals">
		<div class=".container">
			<div v-if="gameRequest"
				class="pong-modal bg-light rounded-3 
							border border-1 border-dark shadow"
			>
				<div class="p-4">
				<h3>You have a game request!</h3>
				<button @click="answerRequest(true)" type="button" class="btn btn-success mx-2">Accept</button>
				<button @click="answerRequest(false)" type="button" class="btn btn btn-danger mx-2">Refuse</button>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	data() {
		return {
			requestId: "",
			gameRequest: false
		}
	},
	mounted() {
		this.$pongSocket.auth = { token: `${this.$store.getters.tokenRaw}`};
		this.$pongSocket.connect();
		this.$pongSocket.on("gameRequest", (requestId : string) => {
			console.log("got a game request!");
			this.requestId = requestId;
			this.gameRequest = true;
		});
		this.$pongSocket.on("requestCanceled", () => {
			this.gameRequest = false;
		})
		this.$pongSocket.on("inGameUsers", (ids : number[]) => {
			this.$store.dispatch("setinGameUsers", ids);
		})
	},
	unmounted() {
		this.$pongSocket.disconnect();
	},
	methods: {
		answerRequest(accepted : boolean) {
			this.$pongSocket.emit('gameRequestAnswer', {requestId: this.requestId, accepted: accepted});
			this.$pongSocket.on("matchFound", (gameId : string) => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
			this.gameRequest = false;
		}
	}
})

</script>

<style scoped>
.pong-modal {
	 position: absolute;
	 top: 50%;
	 left: 50%;
	 transform: translate(-50%, -50%);
	 text-align: center;
 }
</style>