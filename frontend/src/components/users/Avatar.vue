<script setup lang="ts">
import { computed, onUpdated, ref, watch } from 'vue';
import UserService from '@/services/UserService';
import { useCurrentUserStore } from '@/store/currentUser';

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
const errorMessage = ref<string>('');

UserService.getAvatarOfUser(props.userId).then((av) => (avatar.value = av));

watch(
  () => props.userId,
  () => {
    if (props.isOwner) avatar.value = currentUserStore.avatar;
    else
      UserService.getAvatarOfUser(props.userId).then(
        (av) => (avatar.value = av),
      );
  },
);

watch(
  () => avatar.value,
  () => {
    if (props.isOwner) currentUserStore.updateAvatar(avatar.value);
  },
);

function uploadFile() {
  fileInput.value?.click();
}

function uploadAvatar(event: any) {
  UserService.setMyAvatar(props.userId, event.target.files[0])
    .then((response) => {
      avatar.value = response;
    })
    .catch((error) => {
      fileInput.value!.value = '';
      if (error.response.status === 413)
        errorMessage.value = "File Too Large (max: 1MB)";
      else
        errorMessage.value = error.response.statusText;
    });
}

function restoreAvatar() {
  UserService.resetDefaultAvatar(props.userId).then(
    (response) => (avatar.value = response),
  );
}

function clearErrorMessage() {
  errorMessage.value = '';
}
</script>

<template>
  <img
    v-if="props.isOwner"
    :src="avatar"
    class="img-fluid rounded mx-auto clickable"
    data-bs-toggle="modal"
    data-bs-target="#editAvatar"
    alt="avatar"
  />
  <img v-else :src="avatar" class="img-fluid rounded mx-auto" alt="avatar" />

  <div
    v-if="errorMessage"
    style="z-index: 1000 !important"
    class="alert alert-danger alert-dismissible fade show position-absolute top-50 start-50 translate-middle"
    role="alert"
  >
    <p class="mb-0"><strong>Upload failure:</strong> {{ errorMessage }}</p>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      @click="clearErrorMessage"
    ></button>
  </div>

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
            class="btn btn-success mx-3"
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
            accept="image/png, image/jpeg"
            name="uploaded_file"
            @change="uploadAvatar"
          />
          <button
            type="button"
            class="btn btn-danger mx-3"
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
