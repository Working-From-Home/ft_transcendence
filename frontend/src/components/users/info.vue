<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faSkull } from '@fortawesome/free-solid-svg-icons';

library.add(faGear);
library.add(faTrophy);
library.add(faSkull);
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue';
import UserService from '@/services/UserService';
import { useStatusStore } from '@/store/modules/status/status';
import ChallengeButton from '@/components/pong/ChallengeButton.vue';
import WatchButton from '@/components/pong/WatchButton.vue';
import EditModal from '@/components/users/EditModal.vue';
import FriendButtons from '@/components/users/FriendButtons.vue';
import { Tooltip } from 'bootstrap';

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

const statusStore = useStatusStore();

const tooltips = ref<Tooltip[]>({} as Tooltip[]);
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

onMounted(() => {
  tooltips.value = [new Tooltip('#victories'), new Tooltip('#losses')];
  if (props.isOwner) tooltips.value.push(new Tooltip('#edit'));
});

onUnmounted(() => {
  for (const tooltip of tooltips.value) tooltip.dispose();
});

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

    <div
      v-else
      class="mt-1 mt-md-2 mx-5 position-absolute end-0"
      id="edit"
      data-bs-toggle="tooltip"
      title="edit profile"
    >
      <div
        class="mx-md-5 clickable-cursor"
        data-bs-toggle="modal"
        data-bs-target="#deleteAccount"
      >
        <font-awesome-icon icon="gear" class="fa-lg mx-3" />
      </div>
    </div>
    <EditModal></EditModal>

    <h2>{{ username }}</h2>
    <hr />
    <div class="row gx-3 pb-3 fs-6 fst-italic">
      <div
        class="col-2 offset-3"
        id="victories"
        data-bs-toggle="tooltip"
        title="victories"
      >
        <font-awesome-icon icon="trophy" />
        <span class="fw-bold ms-2">{{ victories }}</span>
      </div>
      <div
        class="col-2 offset-2"
        id="losses"
        data-bs-toggle="tooltip"
        title="losses"
      >
        <font-awesome-icon icon="skull" />
        <span class="fw-bold ms-2">{{ losses }}</span>
      </div>
    </div>

    <div
      class="progress bg-body position-relative mx-sm-2 mb-2"
      style="height: 2rem;"
    >
      <div
        class="progress-bar bg-primary"
        role="progressbar"
        :style="{ width: (xp % 100) + '%' }"
        :aria-valuenow="xp % 100"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <span
        class="position-absolute top-50 start-50 translate-middle fs-6 fst-italic fw-bold default-cursor"
        style="white-space: nowrap"
        >level {{ Math.floor(level) }}&nbsp&nbsp-&nbsp&nbsp{{
          xp % 100
        }}
        %</span
      >
    </div>
    <div v-if="!props.isOwner" class="row m-4 mb-2">
      <div class="col mx-1">
        <FriendButtons :userId="userId"></FriendButtons>
      </div>
      <div v-if="isOnline && !isInGame" class="col mx-1">
        <ChallengeButton :id="'challengeFromProfile'" :userId="props.userId"
          >Challenge</ChallengeButton
        >
      </div>
      <div v-else-if="isInGame" class="col mx-1">
        <WatchButton :userId="props.userId">Challenge</WatchButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
