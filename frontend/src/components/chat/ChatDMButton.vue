<template>
	<button type="button" id="btn-front" class="btn-front btn btn-outline-info" data-bs-target="#staticBackdrop" data-bs-dismiss="modal" aria-label="Close" @click="creatDm">
			DM
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UserService from "@/services/UserService";
import { toNumber } from '@vue/shared';
import ChatService from "../../services/ChatService";

export default defineComponent({
	props: {
		otherUserId: {type: Number, required: true},
	},
	data() {
		return {
			userId: -1 as number,
		}
	},
	created() {
		this.userId = toNumber(localStorage.getItem('userId'))
	},
	methods: {
		creatDm() {
			ChatService.createDm(this.userId, this.otherUserId);
		}
	},
})
</script>