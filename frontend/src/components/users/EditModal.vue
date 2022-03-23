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
  <div class="modal fade" id="deleteAccount" data-bs-backdrop="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Delete your account</h4>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
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
