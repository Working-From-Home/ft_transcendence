<template class="container-fluid">
	<section>
		<the-header></the-header>
		<div class="row align-items-center">
			<router-view class="col-md-6 offset-md-3 gy-5"/>
		</div>
		<mini-chat v-if="isLoggedIn"></mini-chat>
	</section>
</template>


<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MiniChat from "./components/chat/MiniChat.vue";
import TheHeader from "./components/TheHeader/TheHeader.vue";
// import { initSocket, socket } from "./socket";
import { io }  from "socket.io-client";

@Options({
	components: {
		MiniChat,
		TheHeader,
	},
	computed: {
		isLoggedIn() {
			return this.$store.getters.isAuth;
		},
	},
	created() {
		this.$store.dispatch('checkLog');
	},
})
export default class HelloWorld extends Vue {
}
</script>

<style>
html {
  background: #192531;
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
