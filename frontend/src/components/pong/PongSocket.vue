<template>
	
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	mounted() {
		this.$pongSocket.auth = { token: `${this.$store.getters.token}`};
		this.$pongSocket.connect();
		this.$pongSocket.on("gameRequest", (requestId : string) => {
			console.log("got a game request!");
			this.requestId = requestId;
			this.request = true;
		});
	},
	unmounted() {
		this.$pongSocket.disconnect();
	}
})
export default class PongSocket extends Vue {}
</script>
