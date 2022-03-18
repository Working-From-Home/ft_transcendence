<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

library.add(faCircleExclamation);
library.add(faCircleXmark);
library.add(faCircleInfo);
library.add(faCircleCheck);
</script>

<script setup lang="ts">
import { INotification } from '@/models/INotification';
import { Toast } from 'bootstrap';
import moment from 'moment';
import { computed, onMounted, ref, watch } from 'vue';
import { useNotificationsStore } from '@/store/notifications';

const notificationsStore = useNotificationsStore();

const props = defineProps({
  notification: {
    type: Object as () => INotification,
    required: true,
  },
});

let el = ref<HTMLElement>({} as HTMLElement);

const type = computed<string>(() => {
	return 'text-' + props.notification.type;
})

onMounted(() => {
	el.value.addEventListener('hidden.bs.toast', unset);
	const toast = new Toast('#notification', {delay: 2500});
	toast.show();
})

watch(() => props.notification, () => {
	el.value.addEventListener('hidden.bs.toast', unset);
	const toast = new Toast('#notification', {delay: 2500});
	toast.show();
});

function unset() {
	el.value.removeEventListener('hidden.bs.toast', unset);
	notificationsStore.dequeue();
}

function timeFromNow() {
	const date = parseInt(props.notification.date);
  return moment(date).fromNow();
}
</script>

<template>
	<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div ref="el" id="notification" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-dark">

				<div class="px-2" :class="type">
					<font-awesome-icon v-if="notification.type === 'warning'" icon="circle-exclamation" />
					<font-awesome-icon v-if="notification.type === 'danger'" icon="circle-xmark" />
					<font-awesome-icon v-if="notification.type === 'info'" icon="circle-info" />
					<font-awesome-icon v-if="notification.type === 'success'" icon="circle-check" />
				</div>

        <strong class="me-auto" :class="type">{{ notification.header }}</strong>
        <small>{{timeFromNow()}}</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body bg-dark">
        {{ notification.body }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
