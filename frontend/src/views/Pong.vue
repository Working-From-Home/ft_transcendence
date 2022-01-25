<template>
	<card>
		<h1>Pong view:</h1>
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
	mounted() {
		pongSocket.auth = {token : `${this.$store.getters.token}`};
		pongSocket.connect();
	},
	unmounted() {
		pongSocket.disconnect();
	}
})
export default class Pong extends Vue {

}
</script> 

<style scoped>
</style>
