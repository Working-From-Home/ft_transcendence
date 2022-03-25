<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import ButtonTemplate from './ButtonTemplate.vue';
import AddTwofaModal from '@/components/auth/AddTwofaModal.vue';
import { Modal } from 'bootstrap';
import { computed, onMounted, reactive, ref } from 'vue';
import { useCurrentUserStore } from '@/store/currentUser';
import UserService from '@/services/UserService';
import axios, { AxiosError } from 'axios';
import { IError } from '@/models/IError';

const authStore = useAuthStore();
const currentUserStore = useCurrentUserStore();
const route = useRouter();

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

const twoFaModal = ref<Modal>();

onMounted(() => {
  twoFaModal.value = new Modal('#addTwoFA');
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
  return true;
});

const submit = async () => {
  let success = true;
  if (state.username != currentUserStore.username) {
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
  }
  if (success) registrationDone();
};

const registrationDone = () => {
  authStore.registerInProgress = false;
};

function setupTwoFA() {
  setTimeout(() => {
    twoFaModal.value!.show();
  }, 400);
}

function deleteAccount() {
  authStore.deleteAccount();
  route.replace('/');
}
</script>

<template>
  <div class="modal fade" id="setup" data-bs-backdrop="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Manage your account</h4>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <h5 class="mb-4">Change your username</h5>
          <form @submit.prevent="submit" class="needs-validation">
            <div class="form-floating mx-3 mb-4">
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
              <div class="invalid-feedback position-absolute">
                {{ state.usernameError }}
              </div>
              <div class="valid-feedback position-absolute">
                Username available
              </div>
            </div>
            <ButtonTemplate
              type="submit"
              class="btn btn-success mt-3"
              :disabled="!canContinue"
              style="min-width: 8.5rem"
              data-bs-dismiss="modal"
            >
              Save
            </ButtonTemplate>
          </form>

          <hr />
          <h5 class="mb-4">Set two-factor authentication</h5>
          <p>Enable double authentication with Google Authenticator</p>
          <ButtonTemplate
            type="button"
            class="btn btn-success"
            style="min-width: 8.5rem"
            @click="setupTwoFA"
            data-bs-dismiss="modal"
          >
            Enable
          </ButtonTemplate>

          <hr />
          <h5 class="mb-4">Delete your account</h5>
          <p>Are you sure? This action is irreversible.</p>
          <ButtonTemplate
            type="button"
            class="btn btn-danger"
            style="min-width: 8.5rem"
            @click="deleteAccount"
            data-bs-dismiss="modal"
          >
            Yes I am sure
          </ButtonTemplate>
        </div>
      </div>
    </div>
  </div>

  <add-twofa-modal />
</template>

<style scoped></style>
