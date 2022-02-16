<template>
	<div>
		<button class="btn btn-outline-light btn-primary" v-if="!isSearching" @click="joinMatchmaking">Search Game</button>
		<button class="btn btn-outline-light btn-info" v-if="isSearching" @click="leaveMatchmaking">Stop searching</button>
		<div v-if="isSearching">
			<p>
				Waiting for an opponent...
			</p>
			<div class="spinner-border"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import  BaseButton  from '../ui/BaseButton.vue'

export default defineComponent({
	components: { BaseButton },
	data() {
		return {
			isSearching: false,
		}
	},
	methods: {
		joinMatchmaking() {
			console.log("joinMatchmaking!");
			this.$pongSocket.emit("joinMatchmaking");
			this.isSearching = true;
			this.$pongSocket.on("matchFound", (gameId : string) => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
		},
		leaveMatchmaking() {
			console.log("leaveMatchmaking!");
			this.$pongSocket.emit("leaveMatchmaking");
			this.$pongSocket.off("matchFound");
			this.isSearching = false;
		}
	},
	unmounted() {
		if (this.isSearching)
			this.leaveMatchmaking();
	}
})

</script>
 
 <style scoped>
</style>