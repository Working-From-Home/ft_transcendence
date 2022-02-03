<template>
	<card>
		<h1>Pong view:</h1>
		<div v-if="request">
			<p>you have a game request!:</p>
			<button @click="answerRequest(true)">accept</button>
			<button @click="answerRequest(false)">refuse</button>
		</div>
		<router-link to='/pong/matchmaking'>matchmaking link</router-link>
		<router-view/>
	</card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { defineComponent, onUnmounted } from 'vue'
import io, { Socket }  from "socket.io-client";

export const pongSocket = io(
															"http://localhost:3000/pong", {
																withCredentials: true,
																autoConnect: false
															}
														);

@Options({
	data() {
		return {
			request: false,
			requestId: ""
		}
	},
	mounted() {
		pongSocket.auth = {token : `${this.$store.getters.token}`};
		pongSocket.connect();
		pongSocket.on("gameRequest", (requestId) => {
			console.log("got a game request!");
			this.requestId = requestId;
			this.request = true;
		});
		if (this.$store.getters.isAuth)
			console.log("yo");
	},
	unmounted() {
		pongSocket.disconnect();
	},
	methods: {
		answerRequest(accepted : boolean) {
			pongSocket.emit('gameRequestAnswer', {requestId: this.requestId, accepted: accepted});
			pongSocket.on("matchFound", gameId => {
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
