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
          <!-- search bar -->
          <div id="smallSearchBar">

            <SearchBar :list="'a'"></SearchBar>

            <!-- <form
              id="smallSearchBar"
              class="mx-auto d-flex my-3 my-lg-0"
              @submit.prevent="goToUserProfile"
            >
              <input
                v-model="userName"
                @input="searchUsers()"
                class="form-control me-1"
                type="search"
                list="list-id"
                placeholder="search for a user"
                aria-label="search for a user"
              />
              <datalist id="list-id">
                <option v-for="result in results" :key="result._id">
                  {{ result.username }}
                </option>
              </datalist>
              <button class="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> -->
          </div>

          <!-- search bar error alert -->
          <!-- <div class="position-absolute top-50 start-50 translate-middle mt-5">
            <div
              v-if="errorMessage"
              style="z-index: 1000 !important"
              class="alert alert-warning alert-dismissible fade show mt-5"
              role="alert"
            >
              <p class="mb-0">{{ errorMessage }}</p>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                @click="clearErrorMessage"
              ></button>
            </div>
          </div> -->
          
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
              <router-link class="logout nav-link active" to="/" @click="logout"
                >Logout
              </router-link>
            </li>
          </ul>
          <!-- large screen mavbar -->
          <ul id="navbar" class="navbar-nav d-none d-lg-flex">
            <li id="searchButton" class="nav-item me-2">
              <a
                class="nav-link active"
                data-bs-toggle="collapse"
                href="#searchBar"
                role="button"
                aria-expanded="false"
                aria-controls="searchBar"
              >
                Search
              </a>
            </li>

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
              <ul
                class="dropdown-menu mt-2 bg-light"
                aria-labelledby="navbarDropdown"
                id="ligthDropdown"
              >
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
            class="d-inline-block align-text-top rounded"
          />
        </div>
      </div>
    </nav>
    <div v-if="connect"></div>
  </div>

  <div id="searchBar" class="collapse bg-light">
    <div class="pt-2 pb-3 mx-5">

      <SearchBar :list="'b'"></SearchBar>
      <!-- <form
        class="mx-auto d-flex my-3 my-lg-0"
        @submit.prevent="goToUserProfile"
      >
        <input
          v-model="userName"
          @input="searchUsers()"
          class="form-control me-1"
          type="search"
          list="list-id"
          placeholder="search for a user"
          aria-label="search for a user"
        />
        <datalist id="list-id">
          <option v-for="result in results" :key="result._id">
            {{ result.username }}
          </option>
        </datalist>
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form> -->
      <!-- search bar error alert -->
      <!-- <div class="position-absolute top-50 start-50 translate-middle mt-5">
        <div
          v-if="errorMessage"
          style="z-index: 1000 !important"
          class="alert alert-warning alert-dismissible fade show mt-5"
          role="alert"
        >
          <p class="mb-0">{{ errorMessage }}</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            @click="clearErrorMessage"
          ></button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChatService from '../../services/ChatService';
import { IChannel, IUserChannel, IMessage } from 'shared/models/socket-events';
import { useAuthStore } from '@/store/auth';
import { useStatusStore } from '@/store/modules/status/status';
import { useChatRoomsStore } from '@/store/modules/chatroom/chatroom';
import { useCurrentUserStore } from '@/store/currentUser';
import { toNumber } from '@vue/shared';
import { useRoute } from 'vue-router';
import SearchBar from './SearchBar.vue';

export default defineComponent({
  components: { SearchBar },
  setup() {
    const authStore = useAuthStore();
    const currentUserStore = useCurrentUserStore();
    const statusStore = useStatusStore();
    const chatRoomsStore = useChatRoomsStore();
    const route = useRoute();
    return { authStore, currentUserStore, statusStore, chatRoomsStore, route };
  },
  data() {
    return {
      userName: '' as string,
      results: [] as any,
      errorMessage: '' as string,
      showSearchbar: false as boolean,
    };
  },
  computed: {
    connect(): boolean {
      if (this.authStore.isLoggedIn) {
        this.$socketapp.auth = {
          token: `${this.authStore.token}`,
        };
        this.$socketapp.connect();

        this.$socketapp.on('connectedUsers', (userIds: number[]) => {
          console.log(`userIds: ${userIds}`);
          this.statusStore.setOnlineUsers(userIds);
        });
        this.$socketapp.on('connect_error', (err: any) => {
          console.log(`socket connexion error: ${err}`);
        });
        this.$socketapp.on('sendChannels', async (resp: IChannel[]) => {
          for (const obj of resp) {
            obj['users'] = await ChatService.sendUserOfChannels(obj['roomId']);
            obj['messages'] = await ChatService.sendMessagesOfChannels(
              obj['roomId'],
            );
          }
          this.chatRoomsStore.fetchRooms(resp);
        });
        this.$socketapp.on('sendChannel', async (resp: IChannel[]) => {
          resp[0]['users'] = await ChatService.sendUserOfChannels(
            resp[0]['roomId'],
          );
          resp[0]['messages'] = await ChatService.sendMessagesOfChannels(
            resp[0]['roomId'],
          );
          this.chatRoomsStore.fetchRoom(resp);
        });
        this.$socketapp.on('leaveChannel', async (channelId: number) => {
          this.chatRoomsStore.leaveChannel(channelId);
        });
      }
      return this.authStore.isLoggedIn;
    },

    // search(): boolean {
    //   const searchLink: any = this.$refs.searchLink;
    //   console.log("searchLink =", searchLink);
    //   // if (searchLink.classList.contains('active'))
    //   //   return true;
    //   return false;
    // }
  },
  methods: {
    search() {
      this.showSearchbar = true;
    },
    logout() {
      this.authStore.logout();
      this.$socketapp.disconnect(); //  to remove an put at the right place too
    },
    searchUsers() {
      this.results = [];
      ChatService.searchUsers(this.userName).then((resp: any) => {
        for (const obj of resp) {
          if (obj.id != toNumber(localStorage.getItem('userId')))
            this.results = this.results.concat(obj);
        }
      });
    },
    goToUserProfile() {
      if (!this.userName) {
        this.errorMessage = 'Enter a username before clicking on search';
        // alert("please put a name")
        return;
      }
      let results = JSON.parse(JSON.stringify(this.results));
      for (const obj of results) {
        if (obj.username === this.userName) {
          this.$router.push('/users/' + obj._id);
          return;
        }
      }
      this.errorMessage = 'This user does not exist';
      // alert(this.userName + " isn't a user in the room")
    },
    clearErrorMessage() {
      this.errorMessage = '';
    },
  },
});
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
      border-bottom: 1px solid $active-link;
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

@include media-breakpoint-up(lg) {
  #smallSearchBar {
    display: none;
  }
}

@include media-breakpoint-down(md) {
  #searchBar {
    display: none;
  }
  #searchButton {
    display: none;
  }
}

input::-webkit-calendar-picker-indicator {
  position: absolute;
  opacity: 0;
}

datalist > option {
  width: 100%;
}
</style>
