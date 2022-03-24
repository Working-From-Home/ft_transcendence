<template>
  <div>
    <form @submit.prevent="login" class="needs-validation">
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
      </div>
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
        Sign in
      </button>
    </form>
    <!-- OAuth -->
    <hr class="hr-text" data-content="Or continue with" />
    <a
      class="btn btn-default btn-oauth rounded-circle rounded-circle"
      role="button"
      v-on:click="loginGoogle"
    >
      <font-awesome-icon :icon="['fab', 'google']" color="white" size="5x" />
    </a>
    <a
      class="btn btn-default btn-oauth"
      role="button"
      v-on:click="loginFortyTwo"
    >
      <img src="../../assets/logo42-white.svg" width="80" />
    </a>
    <p>
      Don't have an account yet ?
      <router-link :to="{ name: 'signup' }" class="link-info"
        >Register here</router-link
      >
    </p>
		<TwofaAuthenticate />
  </div>
</template>

<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

library.add(faGoogle);
</script>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { AuthMode } from '@/views/auth/auth.interface';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { openSignInWindow } from './OauthPopup';
import TwofaAuthenticate from './TwofaAuthenticate.vue';
import { Modal } from 'bootstrap';

const emit = defineEmits<{
  (e: 'changeForm', value: AuthMode): void;
}>();

const authStore = useAuthStore();
const router = useRouter();

const email =  ref('');
const password = ref('');

const errorMessage = ref('');

let twofaModal = {} as Modal

onMounted(() => {
	twofaModal = new Modal('#authTwoFA');
})

const login = async () => {
  const e = await authStore.signInLocal(email.value, password.value);
  if (e)
		errorMessage.value = e.message;
	else if (authStore.twoFaEnabled)
		twofaModal.show();
  else
		router.push('/');
};

const receiveMessageGoogle = async (event: MessageEvent<any>) => {
  window.removeEventListener('message', receiveMessageGoogle);
  const e = await authStore.signInGoogle(event.data);
  if (e) errorMessage.value = e.message;
  else router.push('/');
};
const loginGoogle = async () => {
  window.addEventListener('message', receiveMessageGoogle);
  openSignInWindow(`${process.env.VUE_APP_BACKEND_SERVER_URI}/auth/google/`);
};


const receiveMessageFortyTwo = async (event: MessageEvent<any>) => {
  window.removeEventListener('message', receiveMessageFortyTwo);
  const e = await authStore.signInFortyTwo(event.data);
  if (e) errorMessage.value = e.message;
  else router.push('/');
};
const loginFortyTwo = async () => {
  window.addEventListener('message', receiveMessageFortyTwo);
  openSignInWindow(`${process.env.VUE_APP_BACKEND_SERVER_URI}/auth/42/`);
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
    background-color: #192531;
  }
}
</style>
