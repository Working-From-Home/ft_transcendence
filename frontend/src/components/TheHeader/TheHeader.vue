<template>
  <div class="page-header" >
		<div v-if="!isLoggedIn">
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<div class="container-fluid ">
					<router-link to="/" class="navbar-brand me-auto mb-2 mb-lg-0">FT_Transcendence</router-link>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
						<ul id="navbar" class="navbar-nav">
							<li class="nav-item">
								<router-link to="/auth/signin" class="nav-link active">Signin</router-link>
							</li>
							<li class="nav-item">
								<router-link to="/auth/signup" class="nav-link active">Signup</router-link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
		<div v-if="isLoggedIn">
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<div class="container-fluid">
					<router-link to="/" class="navbar-brand">FT_Transcendence</router-link>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarSupportedContent">
						<form class="mx-auto d-flex">
							<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
							<button class="btn btn-outline-success" type="submit">Search</button>
						</form>
						<ul id="navbar" class="navbar-nav me-3">
							<li class="nav-item">
								<router-link to="/pong" class="nav-link active">Pong</router-link>
							</li>
							<li class="nav-item">
								<router-link to="/chat" class="nav-link active">Chat</router-link>
							</li>
						</ul>
						<ul id="navbar" class="navbar-nav me-3 d-flex">
							<li class="nav-item dropdown">
								<a class="nav-link active dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
									{{ userName }}
								</a>
								<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
									<li><router-link to="/profile" class="dropdown-item">My Profile</router-link></li>
									<li><router-link to="/admin" class="dropdown-item">Admin Pannel</router-link></li>
									<li><hr class="dropdown-divider"></li>
									<li><router-link class="logout dropdown-item" to="/" @click="logout" v-if="isLoggedIn">Logout </router-link></li>
								</ul>
							</li>
						</ul>
						<img :src="count" alt="" width="40" class="me-3 d-inline-block align-text-top">
					</div>
				</div>
			</nav>
		</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

interface State {
  userid: string,
  userName: string,
  avatar: string
}

@Options({
	data: (): State => {
		return {
			userid: '',
			userName: '',
			avatar: '',
		};
	},
	created() {
		this.userid = this.$store.getters.myUserId;
		this.userName = this.$store.getters.myUserName;
		this.avatar = this.$store.getters.myAvatar;
  	},
	computed: {
		isLoggedIn() {
			if (this.$store.getters.isAuth) {
				console.log('this.testUsers', this.testUsers);
				this.$socketapp.auth = {
						token: `${this.$store.getters.token}`
				};
				this.$socketapp.connect();

				this.$socketapp.on("connectedUsers", (...args: any) => {
					this.$store.dispatch('initconnectedUsers', {users: args});
					console.log('connectedUsers', args);
				});
				this.$socketapp.on("connect_error", (err: any) => {
					console.log(`socket connexion error: ${err}`);
				});
			}
			return this.$store.getters.isAuth;
		},
		count(): string {
			this.avatar = 'data:image/png;base64,' + this.$store.getters.myAvatar;
			return this.avatar;
		}
	},
	methods: {
		logout() {
			this.$store.dispatch('logout');
			this.$socketapp.disconnect(); //  to remove an put at the right place too
		},
	}
})
export default class TheHeader extends Vue {

}
</script>

<style scoped>

#navbar a.router-link-exact-active {
  color: #42b983;
}
</style>
