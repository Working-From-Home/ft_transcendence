<template>
	<div>
	<button type="button" class="btn btn btn-warning m-2"
					@click="watchGame"
	>
		<font-awesome-icon icon="eye" />
		&nbspWatch
	</button>

	<div class="modal fade" id="noGameModal">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">

				<div class="modal-header text-black">
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>

				<!-- Modal body -->
				<div class="modal-body text-black">
					<h4>This user isn't playing.</h4>
				</div>

				<!-- Modal footer -->
				<div class="modal-footer">
					<button type="button" class="btn btn-success" data-bs-dismiss="modal">
						OK
					</button>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Modal } from "bootstrap"
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/free-solid-svg-icons";

library.add(faEye);

export default defineComponent({
	props: {
		userId: {type: Number, required: true}
	},
	data() {
		return {
			modal: {} as Modal
		}
	},
	mounted() {
		this.modal = new Modal("#noGameModal");
	},
	methods: {
		watchGame() {
			this.$pongSocket.emit("getGameId", this.userId, (gameId : string) => {
				console.log(`got answer: ${gameId}`);
				if (!gameId) {
					this.modal.show();
					console.log(`no one playing with id ${this.userId}`);
				}
				else {
					this.$router.push({ path: `/pong/${gameId}`});
				}
			});
		}
	}
})
</script>

<style scoped>

</style>
