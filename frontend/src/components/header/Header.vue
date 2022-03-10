<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useCurrentUserStore } from '@/store/currentUser';
import SearchBar from './SearchBar.vue';
import Connect from './Connect.vue';
import socket from '@/socketApp';

const authStore = useAuthStore();
const currentUserStore = useCurrentUserStore();

function logout() {
	authStore.logout();
	socket.disconnect(); //  to remove and put at the right place too
}
</script>

<template>
  <div class="page-header">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <!-- not logged header -->
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
      <!-- logged in header -->
      <div v-if="authStore.isLoggedIn" class="container-fluid mx-lg-4 mx-2">
        <router-link to="/" class="navbar-brand">Transcendence</router-link>
				<!-- hamburger button -->
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
				<!-- navbar -->
        <div class="collapse navbar-collapse" id="connectedNav">
          <!-- search bar -->
          <div class="ms-auto ps-lg-5">
            <div class="ms-lg-5 ps-lg-5">
              <SearchBar></SearchBar>
            </div>
          </div>				
          <ul id="navbar" class="navbar-nav d-lg-flex ms-auto">
            <!-- pong -->
            <li class="nav-item me-2 ms-lg-auto">
              <router-link to="/pong" class="nav-link active">Pong</router-link>
            </li>
            <!-- chat -->
            <li class="nav-item me-2">
              <router-link to="/chat" class="nav-link active">Chat</router-link>
            </li>
            <!-- profile dropdown (only on large screen) -->
            <li class="nav-item me-2 dropdown d-none d-lg-inline-block">
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
                class="dropdown-menu mt-2 bg-light ligth-dropdown"
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
            <!-- profile (only on small screen) -->
            <li class="mx-2 d-lg-none">
              <router-link
                :to="{
                  name: 'profile',
                  params: { userid: authStore.userId },
                }"
                class="nav-link active"
                >Profile</router-link
              >
            </li>
            <!-- logout (only on small screen) -->
            <li v-if="authStore.isLoggedIn" class="mx-2 d-lg-none">
              <router-link class="logout nav-link active" to="/" @click="logout"
                >Logout
              </router-link>
            </li>
            <!-- avatar (only on large screen) -->
            <li class="nav-item d-none d-lg-inline-block">
              <img
                :src="currentUserStore.avatar"
                alt="avatar"
                width="40"
                class="align-text-top rounded"
              /> 
            </li>
					</ul>	         
        </div>
      </div>
    </nav>
    <Connect></Connect>
  </div>
</template>

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

.ligth-dropdown {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
</style>
