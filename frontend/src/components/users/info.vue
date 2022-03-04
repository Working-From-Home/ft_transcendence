<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue';
import UserService from '@/services/UserService';
import { useAuthStore } from '@/store/modules/auth/auth';
import { useStatusStore } from '@/store/modules/status/status';
import ChallengeButton from '@/components/pong/ChallengeButton.vue';
import WatchButton from '@/components/pong/WatchButton.vue';
import ButtonDel from '@/components/users/ButtonDel.vue';
import ButtonAdd from '@/components/users/ButtonAdd.vue';

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
const level = ref<number>(0);
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
      (level.value = response.data.statistics.level),
      (victories.value = response.data.statistics.victories),
      (losses.value = response.data.statistics.losses)
    ),
  );
}
</script>

<template>
  <!-- status badge -->
  <div class="mx-5 position-absolute end-0">
    <div class="mx-md-5">
      <span
        class="badge rounded-pill fs-6 my-2 float-start"
        :class="[
          isOnline && 'bg-success',
          !isOnline && 'bg-danger',
          isInGame && 'bg-warning',
        ]"
        >{{ status }}
      </span>
    </div>
  </div>
  <!-- content -->
  <div class="px-3 pt-3 pb-1">
    <h2 class="pb-3">{{ username }}</h2>
    <div class="row gx-3 py-2">
      <div class="col-12 col-md-4">victories:&nbsp&nbsp{{ victories }}</div>
      <div class="col-12 col-md-4">losses:&nbsp&nbsp{{ losses }}</div>
      <div class="col-12 col-md-4">level:&nbsp&nbsp{{ level }}</div>
    </div>
    <div v-if="props.isOwner" class="m-4">
      <ButtonDel></ButtonDel>
    </div>
    <div v-else-if="!props.isOwner" class="row m-4">
      <!-- <div class="col mx-1">
        <ButtonAdd :userId="userId"></ButtonAdd>
      </div> -->
      <div v-if="isOnline && !isInGame" class="col mx-1">
        <ChallengeButton :userId="props.userId">Challenge</ChallengeButton>
      </div>
      <div v-else-if="isInGame" class="col mx-1">
        <WatchButton :userId="props.userId">Challenge</WatchButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
