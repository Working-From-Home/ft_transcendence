<template>
	<div>
		<button class="btn btn-outline-light" v-if="!isSearching" @click="joinMatchmaking">Search Game</button>
		<button class="btn btn-outline-light" v-if="isSearching" @click="leaveMatchmaking">Stop searching</button>
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
import { pongSocket } from '../../views/Pong.vue'

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
			pongSocket.emit("joinMatchmaking");
			this.isSearching = true;
			pongSocket.on("matchFound", gameId => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
		},
		leaveMatchmaking() {
			console.log("leaveMatchmaking!");
			pongSocket.emit("leaveMatchmaking");
			pongSocket.off("matchFound");
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