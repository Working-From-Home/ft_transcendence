<template>

  <router-link
    v-if="small"
    type="button"
    :to="{ name: 'Chat' }"
    @click="creatDm"
    class="btn text-nowrap btn-sm btn-outline-success"
    style="min-width: 2rem;"
  >
    <font-awesome-icon icon="message" />
  </router-link>

  <button
    v-else
    type="button"
    @click="creatDm"
    class="btn text-nowrap btn-success shadow m-2"
    style="min-width: 8.5rem;"
    data-bs-target="#menuMessageModal"
    data-bs-dismiss="modal"
    aria-label="Close"
  >
    <font-awesome-icon icon="message" class="pe-2" />
    <span class="clickable-cursor">Chat</span>
  </button>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatService from '../../services/ChatService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { useNotificationsStore } from '@/store/notifications';
import { useCurrentUserStore } from '@/store/currentUser';

library.add(faMessage);

export default defineComponent({
  setup() {
	const notificationsStore = useNotificationsStore();
	const currentUserStore = useCurrentUserStore();
	return { notificationsStore, currentUserStore };
  },
  props: {
    otherUserId: { type: Number, required: true },
    small: { type: Boolean, required: false },
  },
  data() {
    return {
      userId: -1 as number
    };
  },
  created() {
    this.userId = this.currentUserStore.userId;
  },
  methods: {
    creatDm() {
      ChatService.createDm(this.userId, this.otherUserId).catch(({ response }) => {
			this.notificationsStore.enqueue("info", "Information", response.data.message)
   		});
    },
  },
});
</script>
