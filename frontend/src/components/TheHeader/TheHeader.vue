<template>
  <div class="page-header">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <!-- not logged navbar part -->
      <div v-if="!authStore.isLoggedIn" class="container-fluid mx-lg-4 mx-2">
        <router-link to="/" class="navbar-brand">Transcendence</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#notConnectedNav"
          aria-controls="notConnectedNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse justify-content-end"
          id="notConnectedNav"
        >
          <ul id="navbar" class="navbar-nav">
            <li class="nav-item">
              <router-link :to="{ name: 'signin' }" class="nav-link active"
                >Sign in</router-link
              >
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'signup' }" class="nav-link active"
                >Sign up</router-link
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- logged in navbar part -->
      <div v-if="authStore.isLoggedIn" class="container-fluid mx-lg-4 mx-2">
        <router-link to="/" class="navbar-brand">Transcendence</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#connectedNav"
          aria-controls="connectedNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="connectedNav">
          <form class="mx-auto d-flex my-3 my-lg-0">
            <input
              class="form-control me-1"
              type="search"
              placeholder="search for a user"
              aria-label="search for a user"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
					<!-- drop down menu on small screen -->
					<ul id="navbar" class="navbar-nav d-lg-none">
						<li class="nav-item mx-2">
              <router-link to="/pong" class="nav-link active">Pong</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link to="/chat" class="nav-link active">Chat</router-link>
            </li>
						<li class="mx-2">
							<router-link
								:to="{
									name: 'profile',
									params: { userid: authStore.userId },
								}"
								class="nav-link active"
								>Profile</router-link
							>
						</li>
						<li v-if="authStore.isLoggedIn" class="mx-2">
							<router-link
								class="logout nav-link active"
								to="/"
								@click="logout"
								>Logout
							</router-link>
						</li>
					</ul>
					<!-- large screen mavbar -->
          <ul id="navbar" class="navbar-nav d-none d-lg-flex">
            <li class="nav-item me-2">
              <router-link to="/pong" class="nav-link active">Pong</router-link>
            </li>
            <li class="nav-item me-2">
              <router-link to="/chat" class="nav-link active">Chat</router-link>
            </li>
            <li class="nav-item me-3 dropdown">
              <a
                class="nav-link active"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                {{ currentUserStore.username }}&nbsp
              </a>
              <ul class="dropdown-menu mt-2 bg-light" aria-labelledby="navbarDropdown" id="ligthDropdown">
                <li>
                  <router-link
                    :to="{
                      name: 'profile',
                      params: { userid: authStore.userId },
                    }"
                    class="dropdown-item"
                    >Profile</router-link
                  >
                </li>
                <li v-if="authStore.isLoggedIn">
                  <router-link
                    class="logout dropdown-item"
                    to="/"
                    @click="logout"
                    >Logout
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
          <img
            :src="currentUserStore.avatar"
            alt=""
            width="40"
            class="d-inline-block align-text-top"
          />
        </div>
      </div>
    </nav>
	<div v-if="connect"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChatService from "../../services/ChatService";
import { IChannel, IUserChannel, IMessage } from "shared/models/socket-events";
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
          token: `${this.authStore.token}`,
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
					console.log(`resp: ${resp}`);
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
@import '@/../node_modules/bootstrap/scss/functions';
@import '@/../node_modules/bootstrap/scss/variables';
@import '@/../node_modules/bootstrap/scss/mixins';

$active-link: #42b983;

#navbar a.router-link-exact-active {
  color: $active-link;
}
@include media-breakpoint-up(lg) {
  #navbar {
    a.router-link-exact-active,
    a.router-link-exact-active:hover {
      font-weight: bold;
      border-bottom: 1px solid $active-link;
      // border-bottom-left-radius: 2px;
      // border-bottom-right-radius: 2px;
    }
    a {
      border-bottom: 1px solid transparent;
    }
    a:hover {
      border-bottom: 1px solid $active-link;
    }
  }
}
@include media-breakpoint-down(lg) {
  #navbar a.router-link-exact-active {
    border: 1px solid $active-link;
    border-radius: 0.92em;
  }

}

#ligthDropdown {
	border-top: none;
	border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
</style>
