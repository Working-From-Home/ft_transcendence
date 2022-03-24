<template>
  <div
    class="modal fade"
    id="menuMessageModal"
    aria-labelledby="menuMessageModal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header d-flex bd-highlight mb-3">
          <h5 class="modal-title me-auto p-2 bd-highlight">
            About <span style="color: #42b983">{{ modalUserName }}</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col mx-auto">
              <img
                :src="modalAvatar"
                class="col img-fluid rounded mx-auto"
                alt="avatar"
              />
            </div>
            <div class="col my-auto">
              <router-link
                class="link"
                :to="{
                  name: 'profile',
                  params: { userid: modalUserId },
                }"
              >
                <button
                  type="button"
                  id="btn-front"
                  class="btn text-nowrap btn-info shadow m-2"
                  style="min-width: 8.5rem"
                  data-bs-target="#menuMessageModal"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <font-awesome-icon icon="user" class="pe-2" />
                  <span class="clickable-cursor">Profile</span>
                </button>
              </router-link>
              <div v-if="!isCurrent" class="d-flex justify-content-center">
                <chat-block-button :modalUserId="modalUserId" />
                <chat-d-m-button :otherUserId="modalUserId" />
              </div>
              <div v-if="!isCurrent && isOnline" class="row">
                <ChallengeButton
                  v-if="!statusStore.isInGame(modalUserId)"
                  :id="'challengeFromChat'"
                  :userId="modalUserId"
                  class="mx-1"
                  >Challenge</ChallengeButton
                >
                <WatchButton v-else :userId="modalUserId" class="mx-1"
                  >Watch</WatchButton
                >
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="p-2 bd-highlight" v-if="UserInfo.isAdmin">
            <span class="badge rounded-pill fs-6 my-2 float-start bg-success">
              Admin
            </span>
          </div>
          <div class="p-2 bd-highlight" v-if="UserInfo.mutedUntil">
            <span class="badge rounded-pill fs-6 my-2 float-start bg-success">
              Mute
            </span>
          </div>
          <div class="p-2 bd-highlight" v-if="UserInfo.bannedUntil">
            <span class="badge rounded-pill fs-6 my-2 float-start bg-success">
              Ban
            </span>
          </div>
          <div class="p-2 bd-highlight">
            <span
              class="badge rounded-pill fs-6 my-2 float-start"
              :class="[
                isOnline && 'bg-success',
                !isOnline && 'bg-danger',
                isInGame && 'bg-warning',
              ]"
              >{{ status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import ChallengeButton from '@/components/pong/ChallengeButton.vue';
import WatchButton from '@/components/pong/WatchButton.vue';
import ChatDMButton from './ChatDMButton.vue';
import ChatBlockButton from './ChatBlockButton.vue';
import { useStatusStore } from '@/store/status';
import { useAuthStore } from '@/store/auth';
import { IUserChannel } from 'shared/models/socket-events';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faUser);

export default defineComponent({
  setup() {
    const statusStore = useStatusStore();
    const authStore = useAuthStore();
    return { statusStore, authStore };
  },
  components: { ChallengeButton, WatchButton, ChatDMButton, ChatBlockButton },
  props: {
    modalUserId: { type: Number, required: true },
    modalUserName: { type: String, required: true },
    modalAvatar: { type: String, required: true },
    UserInfo: { type: Object as PropType<IUserChannel>, required: true },
    isCurrent: { type: Boolean, required: true },
  },
  computed: {
    isOnline() {
      return this.statusStore.isOnline(this.modalUserId);
    },
    isInGame() {
      return this.statusStore.isInGame(this.modalUserId);
    },
    status() {
      if (!this.isOnline) return 'offline';
      else if (this.isInGame) return 'in a game';
      return 'online';
    },
  },
});
</script>
