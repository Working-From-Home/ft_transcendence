<template>
	<div>
		<div class="modal fade" id="addTwoFA" data-bs-backdrop="static">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">

					<div class="modal-header">
            <h4 class="modal-title">Two factor authentication</h4>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
							@click="resetData"
            ></button>
          </div>

					<div class="modal-body">
						<div>
							<div v-if="QrCodeLoading">
								<div class="spinner-border"></div>
							</div>
							<div v-else>
								<ol class="text-start">
									<li>Download the Google Authenticator app</li>
									<li>Scan the QR code below</li>
									<li>Submit your code</li>
								</ol>
								<img :src="QrCode" alt="Qrcode"  class="mx-3">
								<form @submit.prevent="sendCode">
									<div class="mb-3 mt-3">
										<input v-model="twoFaCode" type="string" class="form-control w-50 mx-auto" placeholder="Enter code" name="twoFaCode" autocomplete="off">
									</div>
									<div v-if="wrongCode">Wrong authentication code!</div> 
									<div class="mb-4">
										<font-awesome-icon icon="circle-info" class="pe-2" />
										<span>You will have to log in again</span>
									</div>
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

library.add(faCircleInfo);

export default defineComponent({
	setup() {
		const authStore = useAuthStore();
		return { authStore };
	},
	data() {
		return {
			QrCodeLoading: true,
			QrCode: "",
			twoFaCode: "",
			wrongCode: false,
			modal: {} as Modal,
		}
	},
	mounted() {
		this.modal = new Modal('#addTwoFA');
		this.getQrCode();
	},
	methods: {
		async getQrCode() {
			this.QrCode = await AuthService.generateQrCode();
			console.log(this.QrCode);
			this.QrCodeLoading = false;
		},
		resetData() {
			this.QrCodeLoading = true;
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