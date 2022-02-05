<template>
	<div class="container">
		<!-- <div v-if="request">
			<p>you have a game request!:</p>
			<button @click="answerRequest(true)">accept</button>
			<button @click="answerRequest(false)">refuse</button>
		</div> -->
		<router-view/>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { defineComponent, onUnmounted } from 'vue'
import io, { Socket }  from "socket.io-client";

@Options({
	data() {
		return {
			request: false,
			requestId: ""
		}
	},
	methods: {
		answerRequest(accepted : boolean) {
			this.$pongSocket.emit('gameRequestAnswer', {requestId: this.requestId, accepted: accepted});
			this.$pongSocket.on("matchFound", (gameId : string) => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
		}
	}
})
export default class Pong extends Vue {

}
</script> 

<style scoped>
</style>
