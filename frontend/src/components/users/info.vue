<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGear } from '@fortawesome/free-solid-svg-icons';

library.add(faGear);
</script>

<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue';
import UserService from '@/services/UserService';
import { useAuthStore } from '@/store/auth';
import { useStatusStore } from '@/store/modules/status/status';
import ChallengeButton from '@/components/pong/ChallengeButton.vue';
import WatchButton from '@/components/pong/WatchButton.vue';
import DelButton from '@/components/users/DelButton.vue';
import FriendButtons from '@/components/users/FriendButtons.vue';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
});

const authStore = useAuthStore();
const statusStore = useStatusStore();

const username = ref<string>('');
const email = ref<string>('');
const role = ref<string>('');
const xp = ref<number>(0);
const victories = ref<number>(0);
const losses = ref<number>(0);

const isOnline = computed<boolean>(() => {
  return statusStore.isOnline(props.userId);
});

const isInGame = computed<boolean>(() => {
  return statusStore.isInGame(props.userId);
});

const status = computed<string>(() => {
  if (!isOnline.value) return 'offline';
  else if (isInGame.value) return 'in a game';
  return 'online';
});

const level = computed<number>(() => {
  return xp.value / 100;
});

getUserData(props.userId);

onUpdated(() => {
  getUserData(props.userId);
});

function getUserData(id: number) {
  UserService.getUserById(id).then(
    (response: any) => (
      (username.value = response.data.username),
      (email.value = response.data.email),
      (role.value = response.data.role),
      (xp.value = response.data.statistics.level),
      (victories.value = response.data.statistics.victories),
      (losses.value = response.data.statistics.losses)
    ),
  );
}
</script>

<template>
  <div class="px-3 pt-3 pb-1">
    <!-- status badge -->
    <div v-if="!isOwner" class="mt-0 mt-md-1 mx-5 position-absolute end-0">
      <div class="mx-md-5">
        <span
          class="badge rounded-pill fs-6 shadow-sm bg-light fst-italic"
          :class="[
            isOnline && 'text-success',
            !isOnline && 'text-danger',
            isInGame && 'text-warning',
          ]"
          >{{ status }}
        </span>
      </div>
    </div>

    <div v-else class="mt-1 mt-md-2 mx-5 position-absolute end-0">
      <div class="mx-md-5">
        <font-awesome-icon icon="gear" class="fa-lg me-2" />
      </div>
    </div>


    <h2>{{ username }}</h2>
    <hr />
    <div class="row gx-3 py-2 fs-5 fst-italic">
      <div class="col-12 col-md-4">
        victories:&nbsp&nbsp<span class="fw-bold">{{ victories }}</span>
      </div>
      <div class="col-12 col-md-4">
        losses:&nbsp&nbsp<span class="fw-bold">{{ losses }}</span>
      </div>
      <div class="col-12 col-md-4">
        level:&nbsp&nbsp<span class="fw-bold">{{level}}</span>
      </div>
    </div>
    <div v-if="props.isOwner" class="m-4">
      <DelButton></DelButton>
    </div>
    <div v-else-if="!props.isOwner" class="row m-4 mb-2">
      <div class="col mx-1">
        <FriendButtons :userId="userId"></FriendButtons>
      </div>
      <div v-if="isOnline && !isInGame" class="col mx-1">
        <ChallengeButton :id="'challengeFromProfile'" :userId="props.userId">Challenge</ChallengeButton>
      </div>
      <div v-else-if="isInGame" class="col mx-1">
        <WatchButton :userId="props.userId">Challenge</WatchButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
