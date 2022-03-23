<template>

  <button
    type="button"
    @click="creatDm"
    id="btn-front"
    class="btn text-nowrap"
    :class="
      [small && 'btn-sm btn-outline-success'],
      [!small && 'btn-success shadow m-2']
    "
    :style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
  >
    <font-awesome-icon icon="message" :class="!small && 'pe-2'" />
    <span v-if="!small" class="clickable-cursor">Chat</span>
  </button>



  <!-- <button
    v-if="!small"
    type="button"
    id="btn-front"
    class="btn-front btn btn-outline-info"
    data-bs-target="#staticBackdrop"
    data-bs-dismiss="modal"
    aria-label="Close"
    @click="creatDm"
  >
    DM
  </button>

	<router-link
    v-if="small"
		type="button"
		class="btn btn-sm btn-outline-success"
		:to="{ name: 'Chat' }"
		@click="creatDm"
		style="min-width:2rem"
	>
		<font-awesome-icon icon="message" />
	</router-link> -->

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
			this.notificationsStore.enqueue("warning", "Error", response.data.message)
   		});
    },
  },
});
</script>
