<template>
  <div>
    <button
      class="btn btn-outline-danger"
      v-if="!isSearching"
      @click="joinMatchmaking"
    >
      Search game
    </button>
    <div v-if="isSearching">
      <p>Waiting for another player...</p>
      <div class="spinner-border"></div>
      <div class="mt-3">
        <button
          class="btn btn-outline-light"
          v-if="isSearching"
          @click="leaveMatchmaking"
        >
          Stop searching
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      isSearching: false,
    };
  },
  methods: {
    joinMatchmaking() {
      this.$pongSocket.emit('joinMatchmaking');
      this.isSearching = true;
      this.$pongSocket.on('matchFound', (gameId: string) => {
        this.$router.push({ path: `/pong/${gameId}` });
      });
    },
    leaveMatchmaking() {
      this.$pongSocket.emit('leaveMatchmaking');
      this.$pongSocket.off('matchFound');
      this.isSearching = false;
    },
  },
  unmounted() {
    if (this.isSearching) this.leaveMatchmaking();
  },
});
</script>

<style scoped></style>
