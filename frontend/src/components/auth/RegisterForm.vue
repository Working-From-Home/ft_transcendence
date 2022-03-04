<template>
  <div>
    <form @submit.prevent="register" class="needs-validation">
      <!-- Email input -->
      <div class="form-floating mb-4">
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          placeholder=""
          required
          autofocus
        />
        <label for="email" class="text-black">Email address</label>
      </div>
      <!-- Password input -->
      <div class="form-floating mb-4">
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          placeholder=""
          required
        />
        <label for="password" class="text-black">Password</label>
        <div id="passwordHelpBlock" class="form-text">
          Must be at least 1 characters long.
        </div>
      </div>
      <!-- Confirm Password -->
      <!-- <div class="form-floating mb-4">
      <input v-model="passwordConfirm" type="password" class="form-control" id="password" placeholder="" required />
      <label for="password" class="text-black">Confirm Password</label>
    </div> -->

      <!-- Error from backend -->
      <!-- <div :hidden="errorMessage == ''" class="alert alert-danger" role="alert" > -->
      <div
        :style="{ visibility: errorMessage ? 'visible' : 'hidden' }"
        class="alert alert-danger"
        role="alert"
      >
        {{ errorMessage }}
      </div>
      <!-- Submit button -->
      <button type="submit" class="btn btn-primary btn-lg btn-block">
        Register
      </button>
    </form>
    <hr class="hr-text" data-content="Or continue with" />
    <a
      class="btn btn-default btn-oauth rounded-circle rounded-circle"
      role="button"
    >
      <font-awesome-icon :icon="['fab', 'google']" color="white" size="5x" />
    </a>
    <a class="btn btn-default btn-oauth" role="button">
      <img src="../../assets/logo42-white.svg" width="80" />
    </a>
    <p>
      Already have an account ?
      <router-link :to="{ name: 'signin' }" class="link-info"
        >Login instead</router-link
      >
    </p>
  </div>
</template>

<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

library.add(faGoogle);
</script>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { ref } from 'vue';
import { AuthMode } from '@/views/auth/auth.interface';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
  (e: 'changeForm', value: AuthMode): void;
}>();

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');

const register = async () => {
  const e = await authStore.signUp(email.value, password.value);
  if (e) errorMessage.value = e.message;
  else {
    authStore.registerInProgress = true;
    emit('changeForm', AuthMode.RegisterOptional);
  }
};

</script>

<style lang="scss" scoped>
// Inspect
*:hover {
  outline: 1px blue solid;
}

// utils
@mixin filter-invert($n: 100%) {
  -webkit-filter: invert($n); /* safari 6.0 - 9.0 */
  filter: invert($n);
}

// For oauth buttons

.btn-oauth:active,
.btn-oauth:hover {
  @include filter-invert(100%);
  // background-color: red;
  transition-duration: 0.1s;
  border: white solcid 5px;
  background: black;
}

.btn-42::before {
  content: url(../../assets/logo42-black.svg);
  width: 30px;
  float: left;
  margin-right: 5px;
  margin-top: 3px;
  margin-left: -10px;
  margin-bottom: -10px;
}

// Just for "---- OR ----"
.hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: #192531;
  text-align: center;
  height: 1.5em;
  opacity: 1;
  &:before {
    content: '';
    background: linear-gradient(to right, transparent, #ffffffff, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 3px;
  }
  &:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;

    padding: 0 0.5em;
    line-height: 1.5em;
    color: white;
    /* // this is really the only tricky part, you need to specify the background color of the container element... */
    background-color: $app-background;
  }
}
</style>
