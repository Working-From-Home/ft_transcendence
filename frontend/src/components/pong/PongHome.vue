<template>
	<div>
		<div class="col-md-10 p-4 m-auto mt-4 mb-4 bg-info bg-opacity-75 rounded-3">
			<h3 class="display-6 fw-bold">Welcome to the pong part of the app!</h3>
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
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStatusStore } from '@/store/modules/status/status'
import PongMatchmaking from './PongMatchmaking.vue'
import { useCurrentUserStore } from '@/store/currentUser'

export default defineComponent({
  components: { PongMatchmaking },
	setup() {
		const statusStore = useStatusStore();
		const currentUserStore = useCurrentUserStore();
		return { statusStore, currentUserStore };
	},
	mounted() {
		const id = this.currentUserStore.userId!;
		console.log(`yo: ${id}`);
		if (!this.statusStore.getinGameusers.includes(id))
			return ;
		
		this.$pongSocket.emit("getGameId", id, (gameId : string) => {
				if (gameId)
					this.$router.push({ path: `/pong/${gameId}`});
			});
	},
	methods: {},
})

</script>
 
 <style scoped>
 
</style>