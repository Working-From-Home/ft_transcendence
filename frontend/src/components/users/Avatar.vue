<script setup lang="ts">
import { ref, watch } from 'vue';
import UserService from '@/services/UserService';
import { useCurrentUserStore } from '@/store/currentUser';
import { useNotificationsStore } from '@/store/notifications';

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
const notificationsStore= useNotificationsStore();

const fileInput = ref<HTMLInputElement>();
const avatar = ref<string>('');

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
        notify("danger", "upload failure", "File Too Large (max: 1MB)");
      else
        notify("danger", "upload failure", error.response.statusText);
    });
}

function restoreAvatar() {
  UserService.resetDefaultAvatar(props.userId).then(
    (response) => {
      avatar.value = response;
    }
  );
}

function notify(type: string, header: string, body: string) {
  notificationsStore.enqueue(type, header, body);
}
</script>

<template>
  <img
    v-if="props.isOwner"
    :src="avatar"
    width="200"
    class="img-fluid rounded mx-auto clickable-cursor"
    data-bs-toggle="modal"
    data-bs-target="#editAvatar"
    alt="avatar"
  />
  <img v-else :src="avatar" class="img-fluid rounded mx-auto" alt="avatar" />
  <!-- Modal -->
  <div
    v-if="props.isOwner"
    class="modal fade"
    id="editAvatar"
    data-bs-backdrop="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit your avatar</h4>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <p>What do you want to do ?</p>
          <button
            type="button"
            class="btn btn-success mx-3 my-1"
            data-bs-dismiss="modal"
            @click="uploadFile"
            style="min-width:80px"
          >
            Upload
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
            style="min-width:80px"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
