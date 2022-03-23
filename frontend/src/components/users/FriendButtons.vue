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
import { useCurrentUserStore } from '@/store/currentUser';
import FriendService from '@/services/FriendService';

const currentUserStore = useCurrentUserStore();

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  small: {
    type: Boolean,
    requiored: false,
    default: false,
  },
});

function sendRequest() {
  FriendService.sendFriendRequest(currentUserStore.userId, props.userId).then(() => {
    currentUserStore.updateSent(currentUserStore.userId);
  });
}

function acceptRequest() {
  FriendService.acceptFriendship(currentUserStore.userId, props.userId).then(() => {
    currentUserStore.updatePendings(currentUserStore.userId);
    currentUserStore.updateFriends(currentUserStore.userId);
  });
}

function declineFriendship() {
  FriendService.endFriendship(currentUserStore.userId, props.userId, "pending").then(() => {
    currentUserStore.updatePendings(currentUserStore.userId);
  });
}

function endFriendship() {
  FriendService.endFriendship(currentUserStore.userId, props.userId, "accepted").then(() => {
    currentUserStore.updateFriends(currentUserStore.userId);
  });
}
</script>

<template>
  <div>
    <!-- request sent -->
    <div v-if="currentUserStore.isSent(props.userId)">
      <button
        v-if="currentUserStore.isSent(props.userId)"
        type="button"
        disabled
        class="btn text-nowrap"
        :class="
          [props.small && 'btn-sm btn-outline-info'],
          [!props.small && 'btn-info shadow m-2']
        "
        :style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
      >
        <font-awesome-icon icon="hourglass" :class="!small && 'pe-2'" />
        <span v-if="!props.small" class="clickable-cursor">Request sent</span>
      </button>
    </div>
    <!-- accept / decline -->
    <div
      v-else-if="currentUserStore.isPending(props.userId)"
      class="d-flex flex-row"
      :class="[props.small && 'justify-content-end'], [!props.small && 'justify-content-center']"
    >
    <div>
        <button
          type="button"
          @click="acceptRequest"
          class="btn text-nowrap"
          :class="
            [props.small && 'btn-sm btn-outline-info mx-1'],
            [!props.small && 'btn-info shadow m-2']
          "
          :style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
        >
          <font-awesome-icon icon="check" :class="!small && 'pe-2'" />
          <span v-if="!props.small" class="clickable-cursor">Accept</span>
        </button>
        <button
          type="button"
          @click="declineFriendship"
          class="btn text-nowrap"
          :class="
            [props.small && 'btn-sm btn-outline-info'],
            [!props.small && 'btn-info shadow m-2']
          "
          :style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
        >
          <font-awesome-icon icon="xmark" :class="!small && 'pe-2'" />
          <span v-if="!props.small" class="clickable-cursor">Decline</span>
        </button>
      </div>
    </div>  
    <!-- end friendship -->
    <div v-else-if="currentUserStore.isFriend(props.userId)">
      <button
        type="button"
        @click="endFriendship"
        class="btn text-nowrap"
        :class="
          [props.small && 'btn-sm btn-outline-info'],
          [!props.small && 'btn-info shadow m-2']
        "
        :style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
      >
        <font-awesome-icon icon="xmark" :class="!small && 'pe-2'" />
        <span v-if="!props.small" class="clickable-cursor">Unfriend</span>
      </button>
    </div>
    <!-- send request -->
    <div v-else>
      <button
        type="button"
        @click="sendRequest"
        class="btn text-nowrap"
        :class="
          [props.small && 'btn-sm btn-outline-info'],
          [!props.small && 'btn-info shadow m-2']
        "
        :style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
      >
        <font-awesome-icon icon="plus" :class="!small && 'pe-2'" />
        <span v-if="!props.small" class="clickable-cursor">Add friend</span>
      </button>
    </div>
  </div>
</template>
