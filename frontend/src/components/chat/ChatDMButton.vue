<template>
  <!-- <button
    type="button"
    id="btn-front"
    class="btn-front btn btn-outline-info"
    data-bs-target="#staticBackdrop"
    data-bs-dismiss="modal"
    aria-label="Close"
    @click="creatDm"
  >
    DM
  </button> -->

	<router-link
    v-if="small"
		type="button"
		class="btn btn-sm btn-outline-success"
		:to="{ name: 'Chat' }"
		@click="creatDm"
		style="min-width:2rem"
	>
		<font-awesome-icon icon="message" />
	</router-link>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserService from '@/services/UserService';
import { toNumber } from '@vue/shared';
import ChatService from '../../services/ChatService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

library.add(faMessage);

export default defineComponent({
  props: {
    otherUserId: { type: Number, required: true },
    small: { type: Boolean, required: false },
  },
  data() {
    return {
      userId: -1 as number,
    };
  },
  created() {
    this.userId = toNumber(localStorage.getItem('userId'));
  },
  methods: {
    creatDm() {
      ChatService.createDm(this.userId, this.otherUserId);
    },
  },
});
</script>
