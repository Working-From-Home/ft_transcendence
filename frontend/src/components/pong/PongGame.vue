<template>
  <div class="row g-3 px-md-5 mt-md-2">
    <div class="col">
      <div class="rounded p-3 pb-5">
        <div class="col col-lg-8 p-2 p-lg-0 m-auto">
          <div class="d-flex flex-row align-items-center mb-4">
            <player-info
              v-if="gotPlayerIds"
              class="col"
              :userId="playerIds[0]"
            />
            <div class="row col">
              <h1 class="col">{{ score[0] }}</h1>
              <h1 class="col">{{ score[1] }}</h1>
            </div>
            <player-info
              v-if="gotPlayerIds"
              class="col"
              :userId="playerIds[1]"
            />
          </div>
          <canvas
            v-if="!finished"
            id="canvas"
            tabindex="0"
            width="640"
            height="400"
            @keydown="handleKeydown"
            @keyup="handleKeyup"
          >
          </canvas>
          <div v-else>
            <h1 class="my-5">{{ winner }} won the game!</h1>
            <router-link to="/pong" class="btn btn-outline-light"
              >Back to pong</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlayerInfo from './PlayerInfo.vue';
import { IGameState, GameCanvas } from './GameCanvas';

export default defineComponent({
  components: { PlayerInfo },
  data() {
    return {
      gameCanvas: {} as GameCanvas,
      playerIds: [] as number[],
      score: [0, 0],
      finished: false,
      winner: '',
    };
  },
  created() {
    this.$pongSocket.emit(
      'joinGame',
      this.$route.params.gameId,
      (playerIds: number[]) => {
        if (playerIds.length === 0) {
          this.$router.push({ path: '/pong' });
        }
        this.playerIds = playerIds;
      },
    )
	
  },
  mounted() {
    this.gameCanvas = new GameCanvas('#canvas');
    const gameState = {
      leftPaddle: { x: 20, y: 160 },
      rightPaddle: { x: 610, y: 160 },
      ball: { x: 315, y: 195 },
      score: [0, 0],
    };
    this.gameCanvas.drawGameState(gameState);
    this.$pongSocket.on('gameState', (gameState: IGameState) => {
      this.score = gameState.score;
      this.gameCanvas.drawGameState(gameState);
    });
    this.$pongSocket.on('gameFinish', (winner: string) => {
      this.winner = winner;
      this.finished = true;
    });
  },
  unmounted() {
    this.$pongSocket.off('gameState');
    this.$pongSocket.emit('leaveGame', this.$route.params.gameId);
  },
  methods: {
    handleKeydown(event: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown'].indexOf(event.code) > -1) {
        event.preventDefault();
        let key = event.code;
        this.$pongSocket.volatile.emit('keydown', key);
      }
    },
    handleKeyup(event: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown'].indexOf(event.code) > -1) {
        event.preventDefault();
        let key = event.code;
        this.$pongSocket.emit('keyup', key);
      }
    },
  },
  computed: {
    gotPlayerIds() {
      if (this.playerIds.length === 0) return false;
      else return true;
    },
  },
});
</script>

<style scoped>
canvas {
  border: 1px solid #f0ffff;
  width: 100%;
}
</style>
