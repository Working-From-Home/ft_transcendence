<template>
  <button
    v-if="!isBlock"
    type="button"
    id="btn-front"
    class="btn text-nowrap btn-info shadow m-2"
	:style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
    @click="blockUser"
  >
	<font-awesome-icon icon="ban" :class="!small && 'pe-2'" />
	<span v-if="!small" class="clickable-cursor">Block</span>
  </button>
  <button
    v-else
    type="button"
    id="btn-front"
    class="btn text-nowrap btn-info shadow m-2"
	:style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
    @click="unblockUser"
  >
	<font-awesome-icon icon="unlock" :class="!small && 'pe-2'" />
	<span v-if="!small" class="clickable-cursor">Unblock</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { computed } from '@vue/runtime-core';
import ChatService from '../../services/ChatService';
import { useChatRoomsStore } from '@/store/chatroom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBan, faUnlock } from '@fortawesome/free-solid-svg-icons';

library.add(faBan);
library.add(faUnlock);

export default defineComponent({
  setup() {
    const chatRoomsStore = useChatRoomsStore();
    return { storeBlock: computed(() => chatRoomsStore.getblock) };
  },
  props: {
    modalUserId: { type: Number, required: true },
	small: { type: Boolean, requiored: false, default: false },
  },
  computed: {
    isBlock() {
      for (const obj of this.storeBlock) {
        if (obj.recipientId === this.modalUserId) return true;
      }
	  console.log("not blocked");
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
  },
});
</script>
