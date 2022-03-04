<script lang="ts">
  import { library } from "@fortawesome/fontawesome-svg-core";
  import { faPlus, faCheck, faHourglass, faXmark } from "@fortawesome/free-solid-svg-icons";

  library.add(faPlus);
  library.add(faCheck);
  library.add(faXmark);
  library.add(faHourglass);
</script>

<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue';
import UserService from "@/services/UserService";
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
});

const authStore = useAuthStore();

function sendRequest() {
	UserService.sendFriendRequest(useAuthStore().userId as number, props.userId);
}

function acceptRequest() {
  UserService.acceptFriendship(useAuthStore().userId as number, props.userId);
}

function endFriendship() {
  UserService.endFriendship(useAuthStore().userId as number, props.userId);
}
</script>

<template>
  <button type="button" @click="sendRequest" class="btn btn-outline-primary m-2">
    <font-awesome-icon icon="plus" />
    &nbspAdd friend
	</button>
  <button type="button" disabled class="btn btn-outline-primary m-2">
		<font-awesome-icon icon="hourglass" />
    &nbspRequest sent
	</button>
  <button type="button" @click="acceptRequest" class="btn btn-outline-primary m-2">
		<font-awesome-icon icon="check" />
    &nbspAccept friendship
	</button>
  <button type="button" @click="endFriendship" class="btn btn-outline-primary m-2">
    <font-awesome-icon icon="xmark"/>
		&nbspEnd friendship
	</button>
</template>