<template>
	<div class="modal fade" id="authTwoFA" data-bs-backdrop="static">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">

					<div class="modal-header">
            <h4 class="modal-title">Two factor authentication: </h4>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>

					<div class="modal-body">
						<div>
								<form @submit.prevent="sendCode">
									<div class="mb-3 mt-3">
										<input v-model="twoFaCode" type="string" class="form-control" placeholder="Enter code" name="twoFaCode" autocomplete="off">
									</div>
									<div v-if="wrongCode">Wrong authentication code!</div> 
									<button type="submit" class="btn btn-primary" >Submit</button>
								</form>
						</div>
					</div>

				</div>
			</div>
		</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthService from "@/services/AuthService"
import { useAuthStore } from "@/store/auth";
import { Modal } from "bootstrap";
import router from "@/router";
import { useCurrentUserStore } from "@/store/currentUser";

export default defineComponent({
	setup() {
		const authStore = useAuthStore();
		const currentUserStore = useCurrentUserStore();
		return { authStore, currentUserStore };
	},
	data() {
		return {
			twoFaCode: "",
			wrongCode: false,
			modal: {} as Modal
		}
	},
	mounted() {
		this.modal = new Modal('#authTwoFA');
	},
	methods: {
		async sendCode() {
			try {
				const response = await AuthService.authenticateTwoFA(this.twoFaCode);
				this.authStore.setState(response.data.access_token);
				this.authStore.twoFaAuthenticated = true;
				await this.currentUserStore.initStore(response.data.id);
				this.modal.hide();
				this.wrongCode = false;
				this.twoFaCode = "";
				router.push('/');
			} catch (err) {
				this.twoFaCode = "";
				this.wrongCode = true;
			}
		}
	}
})

</script>