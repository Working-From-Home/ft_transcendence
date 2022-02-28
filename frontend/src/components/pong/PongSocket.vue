<template>
	<!-- gotChallengeModal -->
	<div class="modal fade" id="gotChallengeModal" data-bs-backdrop="static">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">

				<!-- Modal body -->
				<div class="modal-body text-black">
					You have a game request!
				</div>

				<div class="modal-footer">
					<button @click="answerRequest(true)" type="button" class="btn btn-success mx-2">Accept</button>
					<button @click="answerRequest(false)" type="button" class="btn btn btn-danger mx-2">Refuse</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/modules/auth/auth';
import { useStatusStore } from '@/store/modules/status/status';
import { Modal } from 'bootstrap';
import { defineComponent } from 'vue'

export default defineComponent({
	data() {
		return {
			requestId: "",
			gotChallengeModal: {} as Modal
		}
	},
	setup() {
		const authStore = useAuthStore();
		const statusStore = useStatusStore();

		return { authStore, statusStore };
	},
	mounted() {
		this.gotChallengeModal = new Modal("#gotChallengeModal");

		this.$pongSocket.auth = { token: `${this.authStore.token}`};
		this.$pongSocket.connect();
		this.$pongSocket.on("gameRequest", (requestId : string) => {
			this.requestId = requestId;
			this.gotChallengeModal.show();
		});
		this.$pongSocket.on("requestCanceled", () => {
			this.gotChallengeModal.hide();
		})
		this.$pongSocket.on("inGameUsers", (ids : number[]) => {
			this.statusStore.setInGameUsers(ids);
		})
	},
	unmounted() {
		this.$pongSocket.disconnect();
	},
	methods: {
		answerRequest(accepted : boolean) {
			this.$pongSocket.emit('gameRequestAnswer', {requestId: this.requestId, accepted: accepted});
			this.$pongSocket.on("matchFound", (gameId : string) => {
				this.$router.push({ path: `/pong/${gameId}`});
			})
			this.gotChallengeModal.hide();
		}
	}
})

</script>

<style scoped>
</style>