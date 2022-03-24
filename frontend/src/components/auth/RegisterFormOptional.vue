<template>
  <div>
    <form @submit.prevent="submit" class="needs-validation">
      <div class="d-inline-flex gap-2">
        <div class="form-floating">
          <input
            v-model="state.username"
            v-on:input="checkUsernameAvailability"
            type="text"
            class="form-control"
            :class="[!state.usernameError ? 'is-valid' : 'is-invalid']"
            id="username"
            autocomplete="off"
            required
            autofocus
          />
          <label for="username">How should we call you ?</label>
          <div class="invalid-feedback position-absolute">{{ state.usernameError }}</div>
          <div class="valid-feedback position-absolute">Username available</div>
        </div>
        <button
          class="btn btn-outline-primary position-relative top-0"
          v-on:click="randomUserName"
          type="button"
          id="random-username"
        >
          <font-awesome-icon :icon="['fas', 'dice-five']" size="2x" />
        </button>
      </div>

      <!-- Avatar -->
      <div class="mt-5 mb-4">
        <div class="mb-3">
          <img :src="state.avatar" class="img-thumbnail" width="200" />
        </div>

        <input
          ref="fileInput"
          type="file"
          style="display: none"
          accept="image/*"
          name="uploaded_file"
          @change="changeAvatar"
        />

        <button
          type="button"
          v-on:click="fileInput!.click()"
          class="btn btn-outline-secondary mx-2"
          style="min-width: 5rem;"
        >
          Upload
        </button>

        <button
          type="button"
          v-on:click="state.avatar = currentUserStore.avatar"
          :disabled="state.avatar == currentUserStore.avatar"
          class="btn btn-outline-secondary mx-2"
          style="min-width: 5rem;"
        >
          Reset
        </button>

      </div>
      <!-- Submit button -->
      <div class="hstack gap-3 justify-content-lg-center">

        <!-- <button
          type="button"
          v-on:click="registrationDone"
          class="btn btn-secondary btn-lg btn-block"
        >
          Skip
        </button> -->

        <button
          type="submit"
          class="btn btn-primary btn-lg btn-block"
          :disabled="!canContinue"
        >
          Continue
        </button>

      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDiceFive } from '@fortawesome/free-solid-svg-icons';

library.add(faDiceFive);
</script>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentUserStore } from '@/store/currentUser';
import UserService, { formatImage } from '@/services/UserService';
import axios, { AxiosError } from 'axios';
import { IError } from '@/models/IError';
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const currentUserStore = useCurrentUserStore();
const authStore = useAuthStore();

const fileInput = ref<HTMLInputElement>();

enum FeedbackMessage {
  None = '',
  usernameAlreadyInUse = 'Username is already in use.',
  usernameEmpty = 'Please provide your username.',
}

const state = reactive({
  username: currentUserStore.username,
  usernameError: '',
  avatar: currentUserStore.avatar,
});

const checkUsernameAvailability = async () => {
  if (state.username.length == 0)
    state.usernameError = FeedbackMessage.usernameEmpty;
  else if (
    state.username.trim() !== currentUserStore.username &&
    (await UserService.usernameExists(state.username))
  )
    state.usernameError = FeedbackMessage.usernameAlreadyInUse;
  else state.usernameError = FeedbackMessage.None;
};

const canContinue = computed((): boolean => {
  if (!!state.usernameError) return false;
  if (
    state.username.trim() == currentUserStore.username
  )
    return false;
  return true;
});

const changeAvatar = async () => {
  if (fileInput.value!.files == undefined) state.avatar = '';
  else
    state.avatar = formatImage(await fileInput.value!.files![0].arrayBuffer());
};

const randomUserName = async () => {
  state.username = uniqueNamesGenerator({ dictionaries: [adjectives, colors] });
  checkUsernameAvailability();
};

//save new username and photo
const submit = async () => {
  let success = true;
  if (state.username != currentUserStore.username)
    try {
      const resp = await UserService.updateMe({ username: state.username });
      currentUserStore.username = resp.data.username!;
    } catch (err) {
      const e = err as AxiosError<IError>;
      success = false;
      if (axios.isAxiosError(e))
        state.usernameError = e.response?.data.message.toString()!;
      else alert(err);
    }
  if (state.avatar != currentUserStore.avatar)
    try {
      currentUserStore.avatar = await UserService.setMyAvatar(
        currentUserStore.userId,
        fileInput.value!.files![0],
      );
    } catch (err) {
      const e = err as AxiosError<IError>;
      success = false;
      if (axios.isAxiosError(e)) {
        if (e.response?.status == 413) alert('Image too big...');
      } else alert(err);
    }
  if (success) registrationDone();
};

const registrationDone = () => {
  authStore.registerInProgress = false;
  router.push('/');
};
</script>

<style lang="scss"></style>
