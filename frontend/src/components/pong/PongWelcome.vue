<template>
	<card>
		<h3>Welcome to the pong part of the app!</h3>
		<button @click="sendGameRequest(10)">request user 10</button>


		<teleport to="#modals">
			<div v-if="modal1" class="pong-modal">
				<h1>Modal #1</h1>
			</div>
		</teleport>
		
	</card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { pongSocket } from '../../views/Pong.vue'
import BaseButton from '../ui/BaseButton.vue'

export default defineComponent({
  components: { BaseButton },
	data() {
		return {
			modal1 : false
		}
	},
	methods: {
		sendGameRequest(guestId : number) {
			console.log("send request");
			pongSocket.emit("gameRequest", guestId);
			pongSocket.on("matchFound", gameId => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
		},
	}
})

</script>
 
 <style scoped>
 .pong-modal {
	 position: absolute;
	 top: 50%;
	 left: 50%;
	 transform: translate(-50%, -50%);
	 height: 300px;
	 width: 400px;
	 background: gray;
	 text-align: center;
 }
 
</style>