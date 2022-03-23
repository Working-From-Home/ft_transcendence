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
  socket.off('sendChannels');
  socket.off('connect_error');
  socket.off('connectedUsers');
  socket.off('sendChannel');
  socket.off('leaveChannel');
  socket.off('sendMessage');
  socket.off('changeParam');
  socket.disconnect(); //  to remove and put at the right place too
}
</script>

<template>
  <div class="page-header border-bottom border-terciary">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <!-- not logged header -->
      <div v-if="!authStore.isLoggedIn" class="container-fluid mx-lg-4 mx-2">
        <router-link to="/" class="navbar-brand text-primary fw-bold"
          >Transcendence</router-link
        >
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
        <router-link to="/" class="navbar-brand text-primary fw-bold"
          >Transcendence</router-link
        >
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
              <div class="ms-lg-3">
                <SearchBar></SearchBar>
              </div>
            </div>
          </div>
          <ul id="navbar" class="navbar-nav d-lg-flex ms-auto align-items-center">
            <!-- pong -->
            <li class="nav-item me-lg-3 ms-lg-auto">
              <router-link to="/pong" class="nav-link active">Pong</router-link>
            </li>
            <!-- chat -->
            <li class="nav-item me-lg-3">
              <router-link to="/chat" class="nav-link active">Chat</router-link>
            </li>
            <!-- profile dropdown (only on large screen) -->
            <li class="nav-item me-4 dropdown d-none d-lg-inline-block">
              <a
                class="nav-link active"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                {{ currentUserStore.username }}
              </a>
              <ul
                class="dropdown-menu mt-2"
                aria-labelledby="navbarDropdown"
                id="ligthDropdown"
              >
                <li>
                  <router-link
                    :to="{
                      name: 'profile',
                      params: { userid: currentUserStore.userId },
                    }"
                    class="dropdown-item"
                    >Profile</router-link
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item clickable-cursor"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offc"
                    aria-controls="offc"
                  >
                    Friends
                  </a>
                </li>
                <li v-if="authStore.isLoggedIn">
                  <router-link class="dropdown-item" to="/" @click="logout"
                    >Logout
                  </router-link>
                </li>
              </ul>
            </li>
            <!-- profile (only on small screen) -->
            <li class="d-lg-none">
              <router-link
                :to="{
                  name: 'profile',
                  params: { userid: currentUserStore.userId },
                }"
                class="nav-link active"
                >Profile</router-link
              >
            </li>
            <!-- friends (only on small screen)-->
            <li class="d-lg-none">
              <a
                class="nav-link active clickable-cursor"
                data-bs-toggle="offcanvas"
                data-bs-target="#offc"
                aria-controls="offc"
              >
                Friends
              </a>
            </li>
            <!-- logout (only on small screen) -->
            <li v-if="authStore.isLoggedIn" class="d-lg-none">
              <router-link class="nav-link active" to="/" @click="logout"
                >Logout
              </router-link>
            </li>
            <!-- avatar (only on large screen) -->
            <li class="nav-item d-none d-lg-inline-block">
              <img
                :src="currentUserStore.avatar"
                alt="avatar"
                width="30"
                class="rounded-circle my-auto"
              /> 
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <Connect></Connect>
  </div>
</template>

<style lang="scss" scoped></style>
