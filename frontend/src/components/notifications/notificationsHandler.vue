<script setup lang="ts">
import { computed } from 'vue';
import { INotification } from '@/models/INotification';
import Notification from './notification.vue'
import { useNotificationsStore } from '@/store/notifications';

const notificationsStore = useNotificationsStore();

const notification = computed<INotification>(() => {
	return notificationsStore.getHead();
})
</script>

<template>
  <div v-if="notificationsStore.length">
    <Notification :notification="notification"></Notification>
  </div>
</template>

<style lang="scss" scoped></style>
