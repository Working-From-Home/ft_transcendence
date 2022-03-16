<template class="container-fluid-sm">
  <section>
    <Header></Header>
    <FriendList v-if="authStore.isLoggedIn"></FriendList>
    <div class="row align-items-center">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
    <pong-socket v-if="authStore.isLoggedIn" />
  </section>
</template>

<script setup lang="ts">
import Header from './components/header/Header.vue';
import FriendList from './components/header/FriendsList.vue';
import PongSocket from './components/pong/PongSocket.vue';
import { useAuthStore } from '@/store/auth';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const authStore = useAuthStore();
const route = useRoute();

authStore.initStore();

const isChatView = computed(() => {
  if (route.path === '/chat') return true;
  return false;
});

</script>

<style lang="scss">
html {
  overflow-x: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
