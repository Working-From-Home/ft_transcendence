<template>
	<div>
	<button type="button" class="btn btn btn-warning mx-2"
					@click="watchGame"
	>
		Watch
	</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		playerId: {type: Number, required: true}
	},
	methods: {
		watchGame() {
			this.$pongSocket.emit("getGameId", this.playerId, (gameId : string) => {
				console.log(`got answer: ${gameId}`);
				if (!gameId) {
					console.log(`no one playing with id ${this.playerId}`);
				}
				else {
					this.$router.push({ path: `/pong/${gameId}`});
				}
			});
		}
	}
})
</script>

<style scoped>

</style>
