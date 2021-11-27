<template>
	<section>
		<div id="nav">
			<router-link to="/">Home</router-link><span v-if="isLoggedIn"> | </span>
			<router-link to="/pong" v-if="isLoggedIn">Pong</router-link><span v-if="isLoggedIn"> | </span>
			<router-link to="/chat" v-if="isLoggedIn">Chat</router-link><span v-if="!isLoggedIn"> | </span>
			<router-link to="/auth/signin" v-if="!isLoggedIn">Login</router-link><span v-if="isLoggedIn"> | </span>
			<router-link to="/profile" v-if="isLoggedIn">Your Profile</router-link><span v-if="isLoggedIn"> | </span>
			<router-link class="logout" to="/" @click="logout" v-if="isLoggedIn">Logout </router-link><span v-if="!isLoggedIn"> | </span>
			<router-link to="/auth/signup" v-if="!isLoggedIn">Register</router-link>
		</div>
		<router-view />
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.logout a,
.logout.router-link-exact-active {
	color: #c72407;
}
</style>
