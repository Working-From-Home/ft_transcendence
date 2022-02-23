<template>
  <div>
    <form @submit.prevent="registerOptional" class="needs-validation">
      <!-- Username tmp-->
      <div class="form-floating mb-4">
        <input v-model="username" type="text" class="form-control" id="username" placeholder="" required autofocus />
        <label for="username" class="text-black">Username</label>
      </div>

      <!-- Avatar -->

      <!-- Submit button -->
      <button type="submit" class="btn btn-primary btn-lg btn-block">Skip</button>
      <button type="submit" class="btn btn-primary btn-lg btn-block">Let's play !</button>
    </form>
  </div>
</template>

<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

library.add(faGoogle);
</script>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth/auth';
import { ref } from 'vue';
import { AuthMode } from '@/views/auth/auth.interface';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('Just skip (not implemented)');

const registerOptional = async () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>

</style>
