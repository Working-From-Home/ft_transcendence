<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import { useRoute } from 'vue-router';
import Avatar from '@/components/users/Avatar.vue';
import Info from '@/components/users/info.vue';
import History from '@/components/users/History.vue';
import { useCurrentUserStore } from '@/store/currentUser';

const currentUserStore = useCurrentUserStore();
const route = useRoute();

const userId = ref<number>(0);
const isOwner = ref<boolean>(false);

userId.value = +route.params.userid;
isOwner.value = userId.value === currentUserStore.userId;

onUpdated(() => {
  userId.value = +route.params.userid;
  isOwner.value = userId.value === currentUserStore.userId;
});

</script>

<template>
  <div class="container my-2 px-5">
    <!-- row 1 -->
    <div class="row g-3 px-md-5 mt-md-2">
      <div class="col-12 col-ms-12 col-md-3">
        <div
          class="grdt rounded d-flex flex-column justify-content-center h-100 overflow-hidden"
        >
          <avatar v-cloak :userId="userId" :isOwner="isOwner"></avatar>
        </div>
      </div>
      <div class="col pt-ms-3">
        <div class="gradient-blue-inverted rounded h-100">
          <info v-cloak :userId="userId" :isOwner="isOwner"></info>
        </div>
      </div>
    </div>
    <!-- row 2 -->
    <div class="row g-3 px-md-5">
      <div class="col pt-3">
        <div class="gradient-blue rounded h-100">
          <history v-cloak :userId="userId"></history>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/custom.scss";

@include media-breakpoint-up(md) {
  .grdt {
    background: linear-gradient(180deg, rgba(#74A4BC, 0), rgba(#74A4BC, .15));
  }
}

</style>
