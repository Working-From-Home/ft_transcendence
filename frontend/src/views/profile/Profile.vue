<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth/auth';
import Avatar from "@/components/users/Avatar.vue";
import Info from "@/components/users/Info.vue";
import History from "@/components/users/History.vue";

const authStore = useAuthStore();
const route = useRoute();

const userId = ref<number>(0);
const isOwner = ref<boolean>(false);

userId.value = +route.params.userid;
isOwner.value = userId.value === authStore.userId;

</script>

<template>  
  <div class="container py-5 px-5 bg-info">
    <div class="row">
      <div class="col col-sm-12 col-md-3 rounded bg-white">
        <avatar :userId="userId" :isOwner="isOwner"></avatar>
      </div>
      <div class="col col-sm-12 col-md-8 offset-md-1 rounded bg-white">
        <info :userId="userId" :isOwner="isOwner"></info>
      </div>
    </div>
    <div class="row pt-2">
      <div class="col rounded bg-white">
        <history></history>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
