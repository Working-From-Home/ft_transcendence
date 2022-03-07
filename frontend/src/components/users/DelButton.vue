<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import ButtonTemplate from './ButtonTemplate.vue';

const authStore = useAuthStore();
const route = useRouter();

function deleteAccount() {
  authStore.deleteAccount();
  route.replace('/');
}
</script>

<template>
  <ButtonTemplate
    type="button"
    classes="btn btn-danger shadow"
    data-bs-toggle="modal"
    data-bs-target="#deleteAccount"
  >
    Delete account
  </ButtonTemplate>

  <div class="modal fade" id="deleteAccount" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header text-black">
          <h4 class="modal-title">Delete your account</h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body text-black">
          <p>Are you sure ? This action is irreversible.</p>
          <ButtonTemplate
            type="button"
            class="btn btn-danger mt-2"
            @click="deleteAccount"
            data-bs-dismiss="modal"
          >
            Yes I am sure
          </ButtonTemplate>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
