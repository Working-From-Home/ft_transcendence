<template>
	<button v-if="!isBlock" type="button" id="btn-front" class="btn-front btn btn-outline-info" @click="blockUser">
		block
	</button>
	<button v-else type="button" id="btn-front" class="btn-front btn btn-outline-info" @click="unblockUser">
		unblock
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { computed } from '@vue/runtime-core';
import ChatService from "../../services/ChatService";
import { useChatRoomsStore } from '@/store/chatroom'

export default defineComponent({
	setup() {
		const chatRoomsStore = useChatRoomsStore();
		return { storeBlock: computed(() => chatRoomsStore.getblock), };
	},
	props: {
		modalUserId: {type: Number, required: true},
	},
	computed: {
		isBlock() {
			for (const obj of this.storeBlock) {
				if (obj.recipientId === this.modalUserId)
					return true
			}
			return false;
		},
	},
	methods: {
		blockUser() {
			ChatService.blockUser(this.modalUserId);
		},
		unblockUser() {
			ChatService.unBlockUser(this.modalUserId);
		},
	}
})
</script>