<template class="container">
	<section>
		<div class="row w-100">
			<ul id="nav" class="nav justify-content-center">
				<router-link to="/" class="nav-item">Home</router-link>
				<router-link to="/pong" v-if="isLoggedIn" class="nav-item">Pong</router-link>
				<router-link to="/chat" v-if="isLoggedIn" class="nav-item">Chat</router-link>
				<router-link to="/auth/signin" v-if="!isLoggedIn" class="nav-item">Login</router-link>
				<router-link to="/profile" v-if="isLoggedIn" class="nav-item">Your Profile</router-link>
				<router-link class="logout nav-item" to="/" @click="logout" v-if="isLoggedIn">Logout </router-link>
				<router-link to="/auth/signup" v-if="!isLoggedIn" class="nav-item">Register</router-link>
			</ul>
		</div>
		<router-view class="row w-100"/>
	</section>
</template>


<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	computed: {
		isLoggedIn() {
			return this.$store.getters.isAuth;
		},
	},
	created() {
		this.$store.dispatch('checkLog');
	},
	methods: {
		logout() {
			this.$store.dispatch('logout');
		}
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
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.884);
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.nav-item {
  padding-left:30px;
}

.logout a,
.logout.router-link-exact-active {
	color: #c72407;
}
</style>
