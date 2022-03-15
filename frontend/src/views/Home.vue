<script setup lang="ts">
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
</script>

<template>
  <div id="jumbo" class="container my-2 px-5">
    <div class="row g-3 px-md-5 mt-md-2">
      <div class="col">
        <div class="bg-success bg-opacity-25 gradient-blue-inverted rounded p-3">
					<h1 class="display-5 mt-3 fw-bold">Transcendence</h1>
					<i class="fs-6">a 42 project by tlecoeuv,<br>hwinston, juligonz and alesanto</i>
					<div class="m-auto mt-4 mb-3 col-md-8 fs-4">
						<p>This is not C or C++ basic functions! To do something that you’ve never
						done before without a piscine. Remind yourself at the beginning of your journey in
						computer science. Now, look where you are standing. Time to shine</p>
					</div>
        </div>
      </div>
    </div>

    <div v-if="authStore.isLoggedIn" class="row g-3 px-md-5">
      <div class="col-12 col-ms-12 col-md-6 pt-3">
        <div class="h-100 gradient-blue rounded p-3">
          <h2 class="mt-3">Challenge Someone</h2>
          <p>You can play now</p>
          <router-link to="/pong" class="btn btn-outline-light mb-3">Pong</router-link>
        </div>
      </div>

      <div class="col-12 col-ms-12 col-md-6 pt-md-3">
        <div class="h-100 gradient-blue rounded p-3">
          <h2 class="mt-3">Talk to everyone</h2>
          <p>You can use the chat now</p>
          <router-link to="/chat" class="nav-link active">
            <button class="btn btn-outline-light mb-3" type="button">Chat</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
