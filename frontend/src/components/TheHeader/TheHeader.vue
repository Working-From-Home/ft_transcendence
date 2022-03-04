<template>
  <div class="page-header" >
	  	<div v-if="!connect"></div>
		<div v-if="!authStore.isLoggedIn">
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<div class="container-fluid ">
					<router-link to="/" class="navbar-brand me-auto mb-2 mb-lg-0">FT_Transcendence</router-link>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse justify-content-end" id="navbarNav">
						<ul id="navbar" class="navbar-nav">
							<li class="nav-item">
								<router-link :to="{name: 'signin'}" class="nav-link active">Sign in</router-link>
							</li>
							<li class="nav-item">
								<router-link :to="{name: 'signup'}" class="nav-link active">Sign up</router-link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</div>
		<div v-if="authStore.isLoggedIn">
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
									{{ currentUserStore.username }}
								</a>
								<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
									<li><router-link :to="{ name: 'profile', params: { userid: authStore.userId }}" class="dropdown-item">Profile</router-link></li>
									<li><router-link to="/admin" class="dropdown-item">Admin Pannel</router-link></li>
									<li><hr class="dropdown-divider"></li>
									<li v-if="authStore.isLoggedIn"><router-link class="logout dropdown-item" to="/" @click="logout">Logout </router-link></li>
								</ul>
							</li>
						</ul>
						<img :src="currentUserStore.avatar" alt="" width="40" class="me-3 d-inline-block align-text-top">
					</div>
				</div>
			</nav>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChatService from "../../services/ChatService";
import { IChannel, IUserChannel } from "shared/models/socket-events";
import { useAuthStore } from "@/store/auth";
import { useStatusStore } from "@/store/modules/status/status";
import { useChatRoomsStore } from '@/store/modules/chatroom/chatroom'
import { useCurrentUserStore } from "@/store/currentUser";

export default defineComponent({
	setup() {
		const authStore = useAuthStore();
		const currentUserStore = useCurrentUserStore();
		const statusStore = useStatusStore();
		const chatRoomsStore = useChatRoomsStore();
		return { authStore, currentUserStore, statusStore, chatRoomsStore };
	},
	computed: {
		connect(): boolean {
			if (this.authStore.isLoggedIn) {
				this.$socketapp.auth = {
						token: `${this.authStore.token}`
				};
				this.$socketapp.connect();

				this.$socketapp.on("connectedUsers", (userIds: number[]) => {
					console.log(`userIds: ${userIds}`);
					this.statusStore.setOnlineUsers(userIds);
				});
				this.$socketapp.on("connect_error", (err: any) => {
					console.log(`socket connexion error: ${err}`);
				});
				this.$socketapp.on("sendChannels", async (resp: IChannel[]) => {
					for (const obj of resp){
						obj["users"] = await ChatService.sendUserOfChannels(obj["roomId"]);
						obj["messages"] = await ChatService.sendMessagesOfChannels(obj["roomId"]);
					}
					this.chatRoomsStore.fetchRooms(resp);
				});
				this.$socketapp.on("sendChannel", async (resp: IChannel[]) => {
					resp[0]["users"] = await ChatService.sendUserOfChannels(resp[0]["roomId"]);
					resp[0]["messages"] = await ChatService.sendMessagesOfChannels(resp[0]["roomId"]);
					this.chatRoomsStore.fetchRoom(resp);
				});
				this.$socketapp.on("leaveChannel", async (channelId: number) => {
					this.chatRoomsStore.leaveChannel(channelId);
				});
			}
			return this.authStore.isLoggedIn;
		},
	},
	methods: {
		logout() {
			this.authStore.logout();
			this.$socketapp.disconnect(); //  to remove an put at the right place too
		},
	}
})
</script>

<style lang="scss" scoped>

@import "@/../node_modules/bootstrap/scss/functions";
@import "@/../node_modules/bootstrap/scss/variables";
@import "@/../node_modules/bootstrap/scss/mixins";

$active-link:  #42b983;

#navbar a.router-link-exact-active {
	color: $active-link;
}
@include media-breakpoint-up(lg) {
	#navbar{
		a.router-link-exact-active,
		a.router-link-exact-active:hover {
			border-bottom: 5px solid $active-link;
			border-bottom-left-radius: 5px;
			border-bottom-right-radius: 5px;
		}
		a {
			border-bottom: 2px solid transparent;
		}
		a:hover {
			border-bottom: 2px solid $active-link;

		}
	}
}
@include media-breakpoint-down(lg) {
	#navbar a.router-link-exact-active {
		border: 2px solid $active-link;
		border-radius: 0.92em;
	}
}


</style>
