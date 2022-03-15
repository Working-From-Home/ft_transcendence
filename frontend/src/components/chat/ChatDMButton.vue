<template>
  <button
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
	</router-link>
	<module-toast :title="toastProps.title" :message="toastProps.message"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { toNumber } from '@vue/shared';
import { Toast } from "bootstrap";
import ChatService from '../../services/ChatService';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import moduleToast from './Toast.vue';
library.add(faMessage);

export default defineComponent({
  props: {
    otherUserId: { type: Number, required: true },
    small: { type: Boolean, required: false },
  },
  components: {
		moduleToast
	},
  data() {
    return {
      userId: -1 as number,
	  toast: {} as Toast,
	  toastProps: {
		  message: '' as string,
		  title: '' as string,
	  }
    };
  },
  created() {
    this.userId = toNumber(localStorage.getItem('userId'));
  },
  methods: {
    creatDm() {
      ChatService.createDm(this.userId, this.otherUserId).catch(({ response }) => {
			this.toast = new Toast("#toastModal");
			this.toastProps.message = response.data.message;
			this.toastProps.title = "Error";
			this.toast.show();
   		});;
    },
  },
});
</script>
