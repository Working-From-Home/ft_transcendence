<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
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
  <div class="container my-2 px-5">
    <!-- row 1 -->
    <div class="row g-3 px-md-5 mt-md-2">
      <div class="col-12 col-ms-12 col-md-3">
        <div
          class="bg-inverted-gradient rounded d-flex flex-column justify-content-center h-100"
        >
          <avatar v-cloak :userId="userId" :isOwner="isOwner"></avatar>
        </div>
      </div>
      <div class="col pt-ms-3">
        <div class="bg-inverted-gradient rounded h-100">
          <info v-cloak :userId="userId" :isOwner="isOwner"></info>
        </div>
      </div>
    </div>
    <!-- row 2 -->
    <div class="row g-3 px-md-5">
      <div class="col pt-3">
        <div class="bg-inverted-gradienta rounded h-100">
          <history v-cloak :userId="userId"></history>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/../node_modules/bootstrap/scss/functions';
@import '@/../node_modules/bootstrap/scss/variables';
@import '@/../node_modules/bootstrap/scss/mixins';

// .bg-inverted-gradient {
//   background: linear-gradient(180deg, rgba(white, 0), rgba(white, .15))
// }
.bg-inverted-gradient {
  background: linear-gradient(180deg, rgba(red, 0), rgba(red, .15))
}

.bg-inverted-gradienta {
  background: linear-gradient(180deg, rgba(red, .15), rgba(red, 0))
}
</style>
