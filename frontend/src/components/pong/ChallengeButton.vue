<template>
<div>
	<button type="button" class="btn btn btn-danger mx-2" @click="sendGameRequest"
		data-bs-toggle="modal" data-bs-target="#challengeModal"
	>
		challenge
	</button>

	<!-- Modal -->
	<div class="modal fade" id="challengeModal" data-bs-backdrop="static">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">

				<!-- Modal body -->
				<div class="modal-body text-black">
					Waiting for the response..
				</div>

				<!-- Modal footer -->
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-bs-dismiss="modal"
						@click="cancelRequest">
					Cancel request</button>
				</div>
			</div>
		</div>
	</div>

</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		guestId: {type: Number, required: true}
	},
	data() {
		return {
			requestId: "",
		}
	},
	methods: {
		sendGameRequest() {
			console.log("send request");
			this.$pongSocket.emit("gameRequest", this.guestId, (requestId : string) => {
				this.requestId = requestId;
			});
			this.$pongSocket.on("matchFound", (gameId : string) => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
		},
		cancelRequest() {
			console.log("request canceled");
			this.$pongSocket.emit("cancelRequest", this.requestId);
		}
	}
})
</script>

<style scoped>

</style>
