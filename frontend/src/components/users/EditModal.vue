<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import ButtonTemplate from './ButtonTemplate.vue';
import AddTwofaButtonVue from '@/components/auth/AddTwofaButton.vue';
import AddTwofaModal from '@/components/auth/AddTwofaModal.vue';
import { Modal } from 'bootstrap';
import { onMounted, ref } from 'vue';

const authStore = useAuthStore();
const route = useRouter();

const twoFaModal = ref<Modal>();

onMounted(() => {
  twoFaModal.value = new Modal('#addTwoFA');
})

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
          <h5 class="mb-4">Two-factor authentication</h5>
          <p>Enable double authentication with Google Authenticator</p>
          <ButtonTemplate
            type="button"
            class="btn btn-success"
            style="min-width: 8.5rem;"
            @click="setupTwoFA"
            data-bs-dismiss="modal"
          >
            Enable
          </ButtonTemplate>

          <hr>
          <h5 class="mb-4">Delete your account</h5>
          <p>Are you sure? This action is irreversible.</p>
          <ButtonTemplate
            type="button"
            class="btn btn-danger"
            style="min-width: 8.5rem;"
            @click="deleteAccount"
            data-bs-dismiss="modal"
          >
            Yes I am sure
          </ButtonTemplate>
        </div>
      </div>
    </div>
  </div>

  <add-twofa-modal/>
</template>

<style scoped></style>
