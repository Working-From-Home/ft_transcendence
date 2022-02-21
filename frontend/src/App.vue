<template class="container-fluid">
	<section>
		<the-header></the-header>
		<friend-list v-if="authStore.isLoggedIn"></friend-list>
		<div class="row align-items-center">
			<router-view/>
		</div>
		<mini-chat v-if="authStore.isLoggedIn && !isChatView"></mini-chat>
		<pong-socket v-if="authStore.isLoggedIn"/>
	</section>
</template>

<script setup lang="ts">
import MiniChat from "./components/chat/MiniChat.vue";
import TheHeader from "./components/TheHeader/TheHeader.vue";
import FriendList from "./components/OffcanvasFriendsList.vue";
import PongSocket from "./components/pong/PongSocket.vue"
import { useAuthStore } from "@/store/modules/auth/auth";
import { useRoute } from "vue-router";
import { computed } from "vue";

const authStore = useAuthStore();
const route = useRoute();

authStore.initStore();

const isChatView = computed( () => {
	if (route.path === "/chat")
		return true;
	return false;
})

</script>

<style>
html {
  background: #192531;
  overflow-x: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgba(255, 255, 255, 0.884);
  background: #192531;
}
</style>
