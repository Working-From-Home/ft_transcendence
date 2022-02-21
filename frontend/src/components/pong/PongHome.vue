<template>
	<div>
		<div class="col-md-10 p-4 m-auto mt-4 mb-4 bg-info bg-opacity-75 rounded-3">
			<h3 class="display-6 fw-bold">Welcome to the pong part of the app!</h3>
			<challenge-button :guestId="10"></challenge-button>
			<watch-button :playerId="10"></watch-button>
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
import PongMatchmaking from './PongMatchmaking.vue'
import ChallengeButton from './ChallengeButton.vue'
import WatchButton from './WatchButton.vue'

export default defineComponent({
  components: { PongMatchmaking, ChallengeButton, WatchButton },
	methods: {},
})

</script>
 
 <style scoped>
 
</style>