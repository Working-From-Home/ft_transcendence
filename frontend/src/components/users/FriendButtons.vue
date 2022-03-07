<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlus,
  faCheck,
  faHourglass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

library.add(faPlus);
library.add(faCheck);
library.add(faXmark);
library.add(faHourglass);
</script>

<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue';
import { useCurrentUserStore } from '@/store/currentUser';
import UserService from '@/services/UserService';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const currentUserStore = useCurrentUserStore();

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const isFriend = computed<boolean>(() => {
  return currentUserStore.isFriend(props.userId);
});
const isPending = computed<boolean>(() => {
  return currentUserStore.isPending(props.userId);
});
const isSent = computed<boolean>(() => {
  return currentUserStore.isSent(props.userId);
});

function sendRequest() {
  UserService.sendFriendRequest(useAuthStore().userId as number, props.userId);
  currentUserStore.updateFriendLists(useAuthStore().userId as number);
}

function acceptRequest() {
  UserService.acceptFriendship(useAuthStore().userId as number, props.userId);
  currentUserStore.updateFriendLists(useAuthStore().userId as number);
}

function endFriendship() {
  UserService.endFriendship(useAuthStore().userId as number, props.userId);
  currentUserStore.updateFriendLists(useAuthStore().userId as number);
}
</script>

<template>
  <div>
    <button
      v-if="isSent"
      type="button"
      disabled
      class="btn btn-outline-primary m-2"
    >
      <font-awesome-icon icon="hourglass" />
      &nbspRequest sent
    </button>
    <button
      v-else-if="isPending"
      type="button"
      @click="acceptRequest"
      class="btn btn-outline-primary m-2"
    >
      <font-awesome-icon icon="check" />
      &nbspAccept friendship
    </button>
    <button
      v-else-if="isFriend"
      type="button"
      @click="endFriendship"
      class="btn btn-outline-primary m-2"
    >
      <font-awesome-icon icon="xmark" />
      &nbspEnd friendship
    </button>
    <button
      v-else
      type="button"
      @click="sendRequest"
      class="btn btn-outline-primary m-2"
    >
      <font-awesome-icon icon="plus" />
      &nbspAdd friend
    </button>
  </div>
</template>
