<template>
<div class="modal text-black" id="menuMessageModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">More informations about {{ userName }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
		<button type="button" id="btn-front" class="btn-front btn btn-outline-info" data-bs-target="#staticBackdrop" @click="goProfile">
			Open Profile
		</button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserService from "@/services/UserService";
import { Modal } from "bootstrap";

export default defineComponent({
	props: {
		modalMessageUserId: {type: Number, required: true},
		menuMessageModal: {type: Modal, required: true}
	},
	data() {
		return {
			userName: "" as string,
		}
	},
	computed: {
		getName() {
			console.log("modalMessageUserId", this.modalMessageUserId)
			UserService.getUserById(this.modalMessageUserId).then( response => {
				console.log("response", response)
				return this.userName = response.data.username;
			})
		}
	},
	methods: {
		goProfile() {
			this.menuMessageModal.hide();
			//this.$router.push('/profile');
		},
	},
})
</script>