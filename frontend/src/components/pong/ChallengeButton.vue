<template>
<div>
	<button type="button" class="btn btn btn-danger shadow m-2"
		data-bs-toggle="modal" data-bs-target="#settingsModal"
	>
		<font-awesome-icon icon="bolt" />
		&nbspChallenge
	</button>

	<!-- game settings Modal -->
	<div class="modal fade" id="settingsModal" data-bs-backdrop="static">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">

				<!-- Modal Header -->
				<div class="modal-header text-black">
					<h4 class="modal-title">Choose your game settings</h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
				</div>

				<!-- Modal body -->
				<div class="modal-body text-black">

					<p>ball speed</p>
					<select class="form-select mb-3" v-model="gameSettings.speed">
						<option :value=4>slow</option>
						<option :value=6>normal</option>
						<option :value=8>fast</option>
					</select>
					<p>paddle speed</p>
					<select class="form-select mb-3" v-model="gameSettings.paddleSpeed">
						<option :value=3>slow</option>
						<option :value=5>normal</option>
						<option :value=7>fast</option>
					</select>
					<p>number of points to win</p>
					<select class="form-select mb-3" v-model="gameSettings.score">
						<option>3</option>
						<option>5</option>
						<option>8</option>
					</select>
					
					<button type="button" class="btn btn-success"
						data-bs-dismiss="modal"
						@click="sendGameRequest">
						Confirm
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- waiting response Modal -->
	<div class="modal fade" id="challengeModal" data-bs-backdrop="static">
		<div v-if="!errorRequest" class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body text-black">
					Waiting for the response..
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-bs-dismiss="modal"
						@click="cancelRequest">
					Cancel request</button>
				</div>
			</div>
		</div>
		<div v-else class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-body text-black">
					{{errorRequest}}
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-bs-dismiss="modal">
					Ok</button>
				</div>
			</div>
		</div>

	</div>

	<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
		<div id="refusedToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header">
				<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body text-black">
				challenge refused.
			</div>
		</div>
	</div>

</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Modal } from "bootstrap"
import { Toast } from 'bootstrap';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

library.add(faBolt);

export default defineComponent({
	props: {
		userId: {type: Number, required: true}
	},
	data() {
		return {
			requestId: "",
			gameSettings: {speed: 6, paddleSpeed: 5, score: 5},
			challengeModal: {} as Modal,
			refusedToast: {} as Toast,
			errorRequest: ""
		}
	},
	mounted() {
		this.challengeModal = new Modal("#challengeModal");
		this.refusedToast = new Toast("#refusedToast");
	},
	methods: {
		sendGameRequest() {
			this.errorRequest = "";
			this.$pongSocket.emit(
				"gameRequest",
				{
					guestId: this.userId,
					gameSettings: this.gameSettings
				},
				(response : {requestId : string, error : string}) => {
					this.requestId = response.requestId;
					if (!this.requestId) {
						this.errorRequest = response.error;
					}
			});

			this.challengeModal.show();

			this.$pongSocket.on("requestAnswer", (accepted : boolean) => {
				this.challengeModal.hide();
				if (!accepted)
					this.refusedToast.show();
			});

			this.$pongSocket.on("matchFound", (gameId : string) => {
				this.$router.push({ path: `/pong/${gameId}`});
			});
		},
		cancelRequest() {
			this.$pongSocket.emit("cancelRequest", this.requestId);
		}
	}
})
</script>

<style scoped>

</style>
