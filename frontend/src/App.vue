<template class="container-fluid-sm">
  <section>
    <Header></Header>
    <NotificationsHandler></NotificationsHandler>
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
import { computed, onBeforeMount } from 'vue';
import NotificationsHandler from './components/notifications/notificationsHandler.vue';
import { useCurrentUserStore } from './store/currentUser';

const authStore = useAuthStore();
const route = useRoute();

onBeforeMount( async () => {
  const currentUserStore = useCurrentUserStore();
  await currentUserStore.initStore(null);
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
