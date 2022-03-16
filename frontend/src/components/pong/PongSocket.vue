<template>
  <!-- gotChallengeModal -->
  <div class="modal fade" id="gotChallengeModal" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">New challenge!</h4>
        </div>
        <div class="modal-body">
          <player-info :userId="hostId" :small="true"></player-info>
          <h6>wants to play pong with you</h6>
          <button
            @click="answerRequest(true)"
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-success mx-2 mt-3"
          >
            Accept
          </button>
          <button
            @click="answerRequest(false)"
            type="button"
            data-bs-dismiss="modal"
            class="btn btn btn-danger mx-2 mt-3"
          >
            Refuse
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/store/auth';
import { useStatusStore } from '@/store/modules/status/status';
import { Modal } from 'bootstrap';
import { defineComponent } from 'vue';
import PlayerInfo from './PlayerInfo.vue';

export default defineComponent({
  components: { PlayerInfo },
  data() {
    return {
      hostId: 0,
      requestId: '',
      gotChallengeModal: {} as Modal,
    };
  },
  setup() {
    const authStore = useAuthStore();
    const statusStore = useStatusStore();

    return { authStore, statusStore };
  },
  mounted() {
    this.gotChallengeModal = new Modal('#gotChallengeModal');

    this.$pongSocket.auth = { token: `${this.authStore.token}` };
    this.$pongSocket.connect();

    this.$pongSocket.on('gameRequest', (payload) => {
      console.log('got game request!');
      this.hostId = payload.hostId as number;
      this.requestId = payload.requestId;
      console.log(`request from id: ${this.hostId}`);
      this.gotChallengeModal.show();
    });
    this.$pongSocket.on('requestCanceled', () => {
      this.gotChallengeModal.hide();
    });
    this.$pongSocket.on('inGameUsers', (ids: number[]) => {
      this.statusStore.setInGameUsers(ids);
    });
  },
  unmounted() {
    console.log('disconnecting socket');
    this.$pongSocket.off('gameRequest');
    this.$pongSocket.off('requestCanceled');
    this.$pongSocket.off('inGameUsers');
    this.$pongSocket.disconnect();
  },
  methods: {
    answerRequest(accepted: boolean) {
      this.$pongSocket.emit('gameRequestAnswer', {
        requestId: this.requestId,
        accepted: accepted,
      });
      this.$pongSocket.on('matchFound', (gameId: string) => {
        this.$router.push({ path: `/pong/${gameId}` });
      });
    },
  },
});
</script>

<style scoped></style>
