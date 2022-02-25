<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth/auth';
import http from '@/http';

const authStore = useAuthStore();
const route = useRoute();
const games = ref<any>(null);

// const props = defineProps({
//   userId: {
//     type: Number,
//     required: true
//   }
// });

// console.log("props.userID =", props.userId)
// let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/game/' + props.userId;

// const userId = computed<number>(() => (
//   route.path === '/profile' ? authStore.userId : route.params.userid
// ))

const userId: any =
  route.path === '/profile' ? authStore.userId : route.params.userid;
let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/game/' + userId;

http
  .get(url)
  .then(
    (response: any) => (
      (games.value = response.data), console.log('RESPONSE=', response.data)
    ),
  );

function isWinner(winnerId: number) {
  return winnerId == userId;
}

function opponentName(winner: any, looser: any) {
  return winner.id === userId ? looser.username : winner.username;
}

function opponentId(wId: number, lId: number) {
  return wId === userId ? lId : wId;
}

function formatScore(wId: number, wScore: number, lScore: number) {
  if (wId == userId)
    return wScore + ' - ' + lScore;
  return lScore + ' - ' + wScore;
}
</script>

<template>
  <div class="card-body text-black">
    <h2 class="card-title h3">Game history</h2>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Opponent</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="game in games"
          :class="isWinner(game.winner.id) ? 'table-success' : 'table-danger'"
        >
          <th scope="row">{{ game.createdAt }}</th>
          <td>
            <router-link :to="{ name: 'userProfile', params: { userid: opponentId(game.winner.id, game.looser.id) }}">
              {{ opponentName(game.winner, game.looser) }}
            </router-link>
          </td>
          <td>{{ formatScore(game.winner.id, game.winnerScore, game.looserScore) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
