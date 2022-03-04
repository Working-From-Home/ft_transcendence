<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import UserService from '@/services/UserService';
import { useCurrentUserStore } from "@/store/currentUser";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
});

const currentUserStore = useCurrentUserStore();

const fileInput = ref<HTMLInputElement>();
const avatar = ref<string>('');

UserService.getAvatarOfUser(props.userId).then((av) => (avatar.value = av));

onUpdated(() => {
  UserService.getAvatarOfUser(props.userId).then((av) => (avatar.value = av));
  currentUserStore.updateAvatar(avatar.value);
});

function uploadFile() {
  fileInput.value?.click();
}

function uploadAvatar(event: any) {
  UserService.setMyAvatar(props.userId, event.target.files[0]).then(
    (response) => (avatar.value = response),
  );
}

function restoreAvatar() {
  UserService.resetDefaultAvatar(props.userId).then(
    (response) => (avatar.value = response),
  );
}
</script>

<template>
  <img
    :src="avatar"
    class="img-fluid rounded mx-auto"
    :class="props.isOwner && 'clickable'"
    data-bs-toggle="modal"
    data-bs-target="#editAvatar"
    alt="avatar"
  />

  <div
    v-if="props.isOwner"
    class="modal fade"
    id="editAvatar"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header text-black">
          <h4 class="modal-title">Edit your avatar</h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <!-- Modal body -->
        <div class="modal-body text-black">
          <p>What do you want to do ?</p>
          <button
            type="button"
            class="btn btn-outline-success mx-3"
            data-bs-dismiss="modal"
            @click="uploadFile"
          >
            Upload a new avatar
          </button>
          <input
            v-if="props.isOwner"
            type="file"
            style="display: none"
            ref="fileInput"
            accept="image/*"
            name="uploaded_file"
            @change="uploadAvatar"
          />
          <button
            type="button"
            class="btn btn-outline-danger mx-3"
            data-bs-dismiss="modal"
            @click="restoreAvatar"
          >
            restore my default avatar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
