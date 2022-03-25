<template>
  <div>
    <button
      type="button"
      class="btn text-nowrap"
      :class="
        [small && 'btn-sm btn-outline-danger'],
        [!small && 'btn-danger shadow m-2']
      "
      @click="showSetupModal"
      :style="small ? 'min-width: 2rem;' : 'min-width: 8.5rem;'"
    >
      <font-awesome-icon icon="bolt" :class="!small && 'pe-2'"/>
      <span v-if="!small" class="clickable-cursor">Challenge</span>
    </button>

    <!-- game settings Modal -->
    <div class="modal fade" :id="`${id}0`" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Choose your game settings</h4>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            <p>ball speed</p>
            <select class="form-select mb-3" v-model="gameSettings.speed">
              <option :value="4">slow</option>
              <option :value="6">normal</option>
              <option :value="8">fast</option>
            </select>
            <p>paddle speed</p>
            <select class="form-select mb-3" v-model="gameSettings.paddleSpeed">
              <option :value="3">slow</option>
              <option :value="5">normal</option>
              <option :value="7">fast</option>
            </select>
            <p>number of points to win</p>
            <select class="form-select mb-3" v-model="gameSettings.score">
              <option>3</option>
              <option>5</option>
              <option>8</option>
            </select>
            <button
              type="button"
              class="btn btn-success my-1"
              data-bs-dismiss="modal"
              @click="sendGameRequest"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- waiting response Modal -->
    <div class="modal fade" :id="`${id}`" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <p>Waiting for response...</p>
            <button
              type="button"
              class="btn btn-danger my-1"
              data-bs-dismiss="modal"
              @click="cancelRequest"
            >
              Cancel request
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { useNotificationsStore } from '@/store/notifications';

library.add(faBolt);

export default defineComponent({
  props: {
    id: { type: String, required: true },
    userId: { type: Number, required: true },
    small: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      requestId: '',
      gameSettings: { speed: 6, paddleSpeed: 5, score: 5 },
      setupModal: {} as Modal,
      challengeModal: {} as Modal,
      responded: false
    };
  },
  setup() {
    const notificationsStore = useNotificationsStore();
    return { notificationsStore };
  },
  mounted() {
    this.setupModal = new Modal(`#${this.id}0`);
    this.challengeModal = new Modal(`#${this.id}`);
  },
  methods: {
    showSetupModal() {
      if (this.id === 'challengeFromChat') {
        setTimeout(() => {
          this.setupModal.show();
        }, 500);
      }
      else
        this.setupModal.show();
    },
    sendGameRequest() {
      this.responded = false;
      this.$pongSocket.emit(
        'gameRequest',
        {
          guestId: this.userId,
          gameSettings: this.gameSettings,
        },
        (response: { requestId: string; error: string }) => {
          this.requestId = response.requestId;
          if (!this.requestId) {
            this.notificationsStore.enqueue('danger', 'failure', response.error);
          }
        },
      );
      this.challengeModal.show();
      this.watchTimeOut();
      this.$pongSocket.on('requestAnswer', (accepted: boolean) => {
        this.$pongSocket.off('requestAnswer');
        this.responded = true;
        this.challengeModal.hide();
        if (!accepted) {
          this.notificationsStore.enqueue('danger', 'canceled', 'challenge refused');
        }
      });
      this.$pongSocket.on('matchFound', (gameId: string) => {
        this.$router.push({ path: `/pong/${gameId}` });
      });
    },
    cancelRequest() {
      this.$pongSocket.emit('cancelRequest', this.requestId);
      this.$pongSocket.off('requestAnswer');
      this.responded = true;
    },
    watchTimeOut() {
      setTimeout(() => {
        if (!this.responded) {
          this.cancelRequest();
          this.challengeModal.hide();
          this.notificationsStore.enqueue('danger', 'canceled', 'no response');
        }
      }, 30000);
    }
  },
});
</script>

<style scoped></style>