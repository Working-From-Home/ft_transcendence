<template>
	<div>
		<div class="modal fade" id="addTwoFA" data-bs-backdrop="static">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">

					<div class="modal-header">
            <h4 class="modal-title">Two factor authentication: </h4>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
							@click="resetData"
            ></button>
          </div>

					<div class="modal-body">
						<p>
							To use the two factor authentication you need the google authenticator app.
						</p>
						<div v-if="!QrCodeRequested">
							<button
								type="button"
								class="btn btn-primary"
								@click="getQrCode"
							>
								get QrCode
							</button>
						</div>
						<div v-else>
							<div v-if="QrCodeLoading">
								<div class="spinner-border"></div>
							</div>
							<div v-else>
								<p>Scan the QrCode below and submit your code:</p>
								<p>(You will have to login again after that)</p>
								<img :src="QrCode" alt="Qrcode"  class="mx-3">
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
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthService from "@/services/AuthService"
import { useAuthStore } from "@/store/auth";
import { Modal } from "bootstrap";

export default defineComponent({
	setup() {
		const authStore = useAuthStore();
		return { authStore };
	},
	data() {
		return {
			QrCodeRequested: false,
			QrCodeLoading: false,
			QrCode: "",
			twoFaCode: "",
			wrongCode: false,
			modal: {} as Modal,
		}
	},
	mounted() {
		this.modal = new Modal('#addTwoFA');
	},
	methods: {
		async getQrCode() {
			this.QrCodeRequested = true;
			this.QrCodeLoading = true;
			this.QrCode = await AuthService.generateQrCode();
			console.log(this.QrCode);
			this.QrCodeLoading = false;
		},
		resetData() {
			this.QrCodeRequested = false;
			this.QrCodeLoading = false;
			this.twoFaCode = "";
			this.wrongCode = false;
		},
		async sendCode() {
			try {
				const response = await AuthService.turnOnTwoFA(this.twoFaCode);
				this.modal.hide();
				this.resetData();
				this.authStore.logout();
				this.$router.push('/signin');
			} catch (err) {
				this.twoFaCode = "";
				this.wrongCode = true;
			}
		}
	}
})
</script>