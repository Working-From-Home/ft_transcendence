<script setup lang="ts">
import { computed, onUpdated, ref } from 'vue';
import http from '@/http';
import moment from 'moment';
import UserService from '@/services/UserService';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const games = ref<any>(null);

getGameHistory();

onUpdated(() => {
  getGameHistory();
});

function getGameHistory() {
  UserService.getGameHistory(props.userId)
    .then((response: any) => (games.value = response.data));
}

function isWinner(winnerId: number) {
  return winnerId == props.userId;
}

function opponentName(winner: any, looser: any) {
  return winner.id === props.userId ? looser.username : winner.username;
}

function opponentId(wId: number, lId: number) {
  return wId === props.userId ? lId : wId;
}

function formatScore(wId: number, wScore: number, lScore: number) {
  if (wId == props.userId) return wScore + ' - ' + lScore;
  return lScore + ' - ' + wScore;
}

function formatDate(s: string) {
  const date = Date.parse(s);
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
}

function timeFromNow(s: string) {
  const date = Date.parse(s);
  return moment(date).fromNow();
}
</script>

<template>
  <div class="container pt-3">
    <h3 class="mb-2">Match history</h3>
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
          class="table-row"
          :class="isWinner(game.winner.id) ? 'table-success' : 'table-danger'"
        >
          <th
            id="date"
            scope="row"
            data-bs-toggle="tooltip"
            :title="formatDate(game.createdAt)"
          >
            {{ timeFromNow(game.createdAt) }}
          </th>
          <td class="table-value">
            <router-link
              class="link"
              :to="{
                name: 'profile',
                params: { userid: opponentId(game.winner.id, game.looser.id) },
              }"
            >
              {{ opponentName(game.winner, game.looser) }}
            </router-link>
          </td>
          <td class="table-value">
            {{
              formatScore(game.winner.id, game.winnerScore, game.looserScore)
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="!games" class="fst-italic">no game played</p>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.table-value {
  font-weight: bold;
  color: black;
}

</style>
