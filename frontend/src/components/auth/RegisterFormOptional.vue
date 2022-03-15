<template>
  <div>
    <form @submit.prevent="submit" class="needs-validation">
      <!-- Username tmp-->
      <div class="form-floating input-group mb-4">
        <input v-model="state.username" v-on:input="checkUsernameAvailability" type="text" class="form-control" :class="[state.isValid]" id="username" required autofocus/>
        <label for="username" class="text-black">How should we call you ?</label>
        <button class="btn btn-outline-light" v-on:click="randomUserName" type="button" id="random-username">
          <font-awesome-icon :icon="['fas', 'dice-five']" color="white" size="2x"/>
        </button>
        <div class="invalid-feedback">
          {{ state.message }}
        </div>
        <div class="valid-feedback">Username available.</div>
      </div>
      <!-- Avatar -->

      <!-- Submit button -->
      <button type="button" v-on:click="skip" class="btn btn-secondary btn-lg btn-block">
        Skip
      </button>
      <button type="submit" class="btn btn-primary btn-lg btn-block">
        Let's play !
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDiceFive } from '@fortawesome/free-solid-svg-icons';

library.add(faDiceFive);
</script>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentUserStore } from '@/store/currentUser';
import UserService from '@/services/UserService';
import axios, { AxiosError } from 'axios';
import { IError } from '@/models/IError';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import { useAuthStore } from '@/store/auth';


const router = useRouter();
const currentUserStore = useCurrentUserStore();
const authStore = useAuthStore();

enum FeedbackMessage {
  usernameAlreadyInUse = 'Username is already in use.',
  usernameEmpty = 'Please provide your username.',
}

const state = reactive({
  username: currentUserStore.username,
  isValid: 'is-valid',
  message: '',
});

const checkUsernameAvailability = async () => {
  if (state.username.length == 0) {
    state.message = FeedbackMessage.usernameEmpty;
    state.isValid = 'is-invalid';
  } else {
    state.message = FeedbackMessage.usernameAlreadyInUse;
    if (
      (await UserService.usernameExists(state.username)) &&
      state.username !== currentUserStore.username
    )
      state.isValid = 'is-invalid';
    else state.isValid = 'is-valid';
  }
};

const randomUserName = async () => {
  state.username = uniqueNamesGenerator({ dictionaries: [adjectives, colors] });
  checkUsernameAvailability();
}

//save new username and photo
const submit = async () => {
  UserService.updateMe({
    username: state.username,
  }).then( (resp) => {
    currentUserStore.username = resp.data.username!;
  }).catch( (err) => {
    const e = err as AxiosError<IError>;
    if (axios.isAxiosError(e)) alert(e.response?.data.message);
    else alert(err);
    return;
  });
  // UserService.setMyAvatar( currentUserStore.userId, );
  authStore.registerInProgress = false;
  router.push('/');
};

const skip = async () => {
  authStore.registerInProgress = false;
  router.push('/');
};

</script>

<style lang="scss">
// .fa-dice-five:hover,
#random-username {
  border-left: 1px solid $body-bg;
}
#random-username:hover .fa-dice-five {
  color: black;
}
</style>
