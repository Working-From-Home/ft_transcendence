<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import moment from 'moment';
import UserService from '@/services/UserService';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const anonymous = {
  id: 0,
  username: 'anonymous user',
};

const data = ref<any>({});
const count = ref<number>(0);
const currentPage = ref<number>(0);

paginate(`/game/${props.userId}/pagination`);

watch(
  () => props.userId,
  () => {
    paginate(`/game/${props.userId}/pagination`);
  },
);

function paginate(link: string) {
  UserService.getGamePagination(props.userId, link).then((response: any) => {
    let tmp: any = response.data;
    for (let item of tmp.items) {
      if (!item.looser) item.looser = anonymous;
      if (!item.winner) item.winner = anonymous;
    }
    data.value = tmp;
    count.value = response.data.meta.itemCount;
    currentPage.value = response.data.meta.currentPage;
  });
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
  return lScore + ' - ' +  wScore;
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
  <div class="container pt-3 px-md-5">
    <h3 class="mb-3 mt-1">Match history</h3>
    <table class="table rounded">
      <thead>
        <tr class="text-white">
          <th scope="col">Date</th>
          <th scope="col">Opponent</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="game in data.items"
          class="table-row"
          :class="isWinner(game.winner.id) ? 'table-success' : 'table-danger'"
        >
          <th
            :id="`date${game.id}`"
            class="table-value fw-normal"
            scope="row"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="formatDate(game.createdAt)"
          >
            {{ timeFromNow(game.createdAt) }}
          </th>
          <td class="table-value">
            <span
              v-if="opponentId(game.winner.id, game.looser.id) === 0"
              class="fst-italic"
            >
              {{ opponentName(game.winner, game.looser) }}
            </span>

            <router-link
              v-else
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

    <nav v-if="count" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="currentPage == 1 && 'disabled'">
          <a class="page-link clickable" @click="paginate(data.links.first)"
            >First</a
          >
        </li>
        <li class="page-item" :class="currentPage == 1 && 'disabled'">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click="paginate(data.links.previous)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          :class="currentPage == data.meta.totalPages && 'disabled'"
        >
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click="paginate(data.links.next)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
        <li
          class="page-item"
          :class="currentPage == data.meta.totalPages && 'disabled'"
        >
          <a class="page-link clickable" @click="paginate(data.links.last)"
            >Last</a
          >
        </li>
      </ul>
    </nav>
    <div v-if="!count" class="fst-italic">
      <hr />
      <p>no game played</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>

a, a:hover, a:focus {
  outline-style: none;
  box-shadow: none;
}

a:link {
  text-decoration: none;
}

.clickable {
  cursor: pointer;
}

.table-value {
  /* font-weight: bold; */
  color: black;
}

.table > :not(caption) > * > * {
  border-bottom-width: 0 !important;
}

.page-item .page-link {
  background-color: transparent!important;
}
.page-link {
  color: white;
}



</style>
