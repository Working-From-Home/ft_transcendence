<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth/auth';
import Avatar from '@/components/users/Avatar.vue';
import Info from '@/components/users/info.vue';
import History from '@/components/users/History.vue';

const authStore = useAuthStore();
const route = useRoute();

const userId = ref<number>(0);
const isOwner = ref<boolean>(false);

userId.value = +route.params.userid;
isOwner.value = userId.value === authStore.userId;

onUpdated(() => {
  userId.value = +route.params.userid;
  isOwner.value = userId.value === authStore.userId;
});

</script>

<template>
  <div class="container my-5 px-5">
    <!-- row 1 -->
    <div class="row gx-3 gy-3 px-5">
      <!-- avatar -->
      <div class="col-12 col-ms-12 col-md-3">
        <div
          class="bg-light rounded d-flex flex-column justify-content-center"
          style="height: 100%"
        >
          <avatar :userId="userId" :isOwner="isOwner"></avatar>
        </div>
      </div>
      <!-- info card -->
      <div class="col pt-ms-3">
        <div class="bg-light rounded text-black" style="height: 100%">
          <info :userId="userId" :isOwner="isOwner"></info>
        </div>
      </div>
    </div>
    <!-- row 2 -->
    <div class="row g-3 px-5">
      <!-- match history -->
      <div class="col pt-3">
        <div class="bg-light rounded text-black" style="height: 100%">
          <history :userId="userId"></history>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
