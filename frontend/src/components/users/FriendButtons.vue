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
import { useAuthStore } from '@/store/auth';

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
  FriendService.sendFriendRequest(useAuthStore().userId as number, props.userId).then(() => {
    currentUserStore.updateSent(useAuthStore().userId as number);
  });
}

function acceptRequest() {
  FriendService.acceptFriendship(useAuthStore().userId as number, props.userId).then(() => {
    currentUserStore.updatePendings(useAuthStore().userId as number);
    currentUserStore.updateFriends(useAuthStore().userId as number);
  });
}

function declineFriendship() {
  FriendService.endFriendship(useAuthStore().userId as number, props.userId, "pending").then(() => {
    currentUserStore.updatePendings(useAuthStore().userId as number);
  });
}

function endFriendship() {
  FriendService.endFriendship(useAuthStore().userId as number, props.userId, "accepted").then(() => {
    currentUserStore.updateFriends(useAuthStore().userId as number);
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
        class="btn"
        :class="
          [props.small && 'btn-sm btn-outline-primary'],
          [!props.small && 'btn-primary shadow m-2']
        "
        style="min-width:2rem"
      >
        <font-awesome-icon icon="hourglass" />
        <span v-if="!props.small">&nbspRequest sent</span>
      </button>
    </div>
    <!-- accept / decline -->
    <div
      v-else-if="currentUserStore.isPending(props.userId)"
      class="d-flex flex-row"
      :class="props.small && 'justify-content-end'"
    >
    <div>
        <button
          type="button"
          @click="acceptRequest"
          class="btn"
          :class="
            [props.small && 'btn-sm btn-outline-primary mx-1'],
            [!props.small && 'btn-primary shadow m-2']
          "
          style="min-width:2rem"
        >
          <font-awesome-icon icon="check" />
          <span v-if="!props.small">&nbspAccept</span>
        </button>
        <button
          type="button"
          @click="declineFriendship"
          class="btn"
          :class="
            [props.small && 'btn-sm btn-outline-primary'],
            [!props.small && 'btn-primary shadow m-2']
          "
          style="min-width:2rem"
        >
          <font-awesome-icon icon="xmark" />
          <span v-if="!props.small">&nbspDecline</span>
        </button>
      </div>
    </div>  
    <!-- end friendship -->
    <div v-else-if="currentUserStore.isFriend(props.userId)">
      <button
        type="button"
        @click="endFriendship"
        class="btn"
        :class="
          [props.small && 'btn-sm btn-outline-primary'],
          [!props.small && 'btn-primary shadow m-2']
        "
        style="min-width:2rem"
      >
        <font-awesome-icon icon="xmark" />
        <span v-if="!props.small">&nbspEnd friendship</span>
      </button>
    </div>
    <!-- send request -->
    <div v-else>
      <button
        type="button"
        @click="sendRequest"
        class="btn"
        :class="
          [props.small && 'btn-sm btn-outline-primary'],
          [!props.small && 'btn-primary shadow m-2']
        "
        style="min-width:2rem"
      >
        <font-awesome-icon icon="plus" />
        <span v-if="!props.small">&nbspAdd friend</span>
      </button>
    </div>
  </div>
</template>
