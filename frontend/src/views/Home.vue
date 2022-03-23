<script setup lang="ts">
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
</script>

<template>
  <div id="jumbo" class="container my-2 px-5">
    <div class="row g-3 px-md-5 mt-md-2">
      <div class="col">
        <div class="gradient-blue-inverted rounded p-3">
          <h1 class="display-5 mt-3 fw-bold text-primary">Transcendence</h1>
          <small class="fs-6 fst-italic text-secondary"
            >a 42 project by tlecoeuv,<br />hwinston, juligonz and alesanto</small
          >
          <div class="m-auto mt-4 mb-3 col-md-10 fs-5">
            <p>
              This is not C or C++ basic functions! To do something that you’ve
              never done before without a piscine. Remind yourself at the
              beginning of your journey in computer science. Now, look where you
              are standing.
            </p>
            <p class="fst-italic">Time to shine...</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="authStore.isLoggedIn" class="row g-3 px-md-5">
      <div class="col-12 col-ms-12 col-md-6 pt-3 position-relative">
        <div class="h-100 gradient-blue rounded p-3">
          <h2 class="mt-3 mb-3 text-primary">Challenge Someone</h2>
          <p>You can play now</p>
          <router-link to="/pong" class="btn btn-outline-secondary mb-3 stretched-link"
            >Pong</router-link
          >
        </div>
      </div>

      <div class="col-12 col-ms-12 col-md-6 pt-md-3 position-relative">
        <div class="h-100 gradient-blue rounded p-3">
          <h2 class="mt-3 mb-3 text-primary">Talk to everyone</h2>
          <p>You can use the chat now</p>
          <router-link to="/chat" class="btn btn-outline-secondary mb-3 stretched-link">
            Chat
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
