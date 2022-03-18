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
import BaseButton from '../ui/BaseButton.vue';

export default defineComponent({
  components: { BaseButton },
  data() {
    return {
      isSearching: false,
    };
  },
  methods: {
    joinMatchmaking() {
      console.log('joinMatchmaking!');
      this.$pongSocket.emit('joinMatchmaking');
      this.isSearching = true;
      this.$pongSocket.on('matchFound', (gameId: string) => {
        this.$router.push({ path: `/pong/${gameId}` });
      });
    },
    leaveMatchmaking() {
      console.log('leaveMatchmaking!');
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
