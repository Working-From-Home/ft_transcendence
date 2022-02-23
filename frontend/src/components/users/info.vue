<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth/auth';
import ButtonDel from './ButtonDel.vue';
import http from '@/http';

const authStore = useAuthStore();
const route = useRoute();

const userId = ref<number | null>(null);
const username = ref<string>('');
const email = ref<string>('');
const role = ref<string>('');
const level = ref<number>(0);
const victories = ref<number>(0);
const losses = ref<number>(0);

const isMine = computed<boolean>(() => route.path === '/profile');

let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/users/';
url += route.path === '/profile' ? authStore.userId : route.params.userid;

http
  .get(url)
  .then(
    (response: any) => (
      (userId.value = response.data.userId),
      (username.value = response.data.username),
      (email.value = response.data.email),
      (role.value = response.data.role),
      (level.value = response.data.statistics.level),
      (victories.value = response.data.statistics.victories),
      (losses.value = response.data.statistics.losses)
    ),
  );
</script>

<template>
  <div class="text-black">
    <h2 class="pb-2">{{ username }}</h2>
    <p>{{ email }}</p>

    <div class="row pt-3 gx-3">
      <div class="col-4">victories: {{ victories }}</div>
      <div class="col-4">losses: {{ losses }}</div>
      <div class="col-4">level: {{ level }}</div>
    </div>

    <div v-if="isMine" class="row pt-5">
      <button-del></button-del>
    </div>
    <div v-if="!isMine" class="row pt-5">
      <div class="col-5 offset-1">
        <button>Send friend request</button>
      </div>
      <div class="col-5 offset-1">
        <button>Challenge</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
