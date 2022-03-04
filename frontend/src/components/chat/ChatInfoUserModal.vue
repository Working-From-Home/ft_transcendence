<template>
<div class="modal fade text-black" id="menuMessageModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">More informations about {{ modalUserName }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
		<div class="row">
			<div class="col">
				<img
				:src="modalAvatar"
				class="col img-fluid rounded mx-auto"
				alt="avatar"
			/>
			</div>
			<div class="col">
				<router-link
					class="link"
					:to="{
						name: 'profile',
						params: { userid: modalUserId },
					}"
					>
					<button type="button" id="btn-front" class="btn-front btn btn-outline-info" data-bs-target="#staticBackdrop" data-bs-dismiss="modal" aria-label="Close">
						Open Profile
					</button>
				</router-link>
				<chat-d-m-button :otherUserId="modalUserId"/>
				<challenge-button :userId="modalUserId"></challenge-button>
				<watch-button :userId="modalUserId"></watch-button>
			</div>
		</div>
      </div>
      <div class="modal-footer">
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChallengeButton from '../pong/ChallengeButton.vue'
import WatchButton from '../pong/WatchButton.vue'
import ChatDMButton from "./ChatDMButton.vue";

export default defineComponent({
	components: { ChallengeButton, WatchButton, ChatDMButton },
	props: {
		modalUserId: {type: Number, required: true},
		modalUserName: {type: String, required: true},
		modalAvatar: {type: String, required: true},
	},
	data() {
		return {
		}
	},
})
</script>