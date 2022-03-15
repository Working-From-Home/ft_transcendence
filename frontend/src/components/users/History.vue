<script setup lang="ts">
import { onUnmounted, onUpdated, ref, watch } from 'vue';
import moment from 'moment';
import UserService from '@/services/UserService';
import { Tooltip } from 'bootstrap';

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

const items = ref<any>([]);
const links = ref<any>({});
const meta = ref<any>({});
const tooltips = ref<Tooltip[]>([]);

paginate(`/game/${props.userId}/pagination`);

onUpdated(() => {
  unsetTooltips();
  setTooltips();
});

onUnmounted(() => {
  unsetTooltips();
});

watch(
  () => props.userId,
  () => {
    paginate(`/game/${props.userId}/pagination`);
  },
);

function setTooltips() {
  for (const item of items.value) {
    let tooltip = new Tooltip("#date" + item.id);
    tooltips.value.push(tooltip);
  }
}

function unsetTooltips() {
  for (const tooltip of tooltips.value) {
    tooltip.dispose();
  }
  tooltips.value = [];
}

function paginate(link: string) {
  UserService.getGamePagination(props.userId, link).then((response: any) => {
    let tmp: any = response.data;
    for (let item of tmp.items) {
      if (!item.looser) item.looser = anonymous;
      if (!item.winner) item.winner = anonymous;
    }
    items.value = tmp.items;
    links.value = tmp.links;
    meta.value = tmp.meta;
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
  return lScore + ' - ' + wScore;
}

function formatDate(s: string) {
  const date = Date.parse(s);
  return moment(date).format('MMMM Do YYYY, HH:mm');
}

function timeFromNow(s: string) {
  const date = Date.parse(s);
  return moment(date).fromNow();
}
</script>

<template>
  <div class="container pt-3 px-md-5">
    <table class="table table-hover rounded mb-3">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Opponent</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in items" class="table-row">
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
          <td
            class="table-value fw-bold"
            :class="isWinner(game.winner.id) ? 'text-success' : 'text-danger'"
          >
            {{
              formatScore(game.winner.id, game.winnerScore, game.looserScore)
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <!-- navigation -->
    <nav v-if="meta.itemCount" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="meta.currentPage == 1 && 'disabled'">
          <a
            class="page-link"
            href="#"
            @click="paginate(links.first)"
            >First</a
          >
        </li>
        <li class="page-item" :class="meta.currentPage == 1 && 'disabled'">
          <a
            class="page-link"
            href="#"
            @click="paginate(links.previous)"
            >&laquo;</a
          >
        </li>
        <li class="page-item" :class="meta.currentPage == meta.totalPages && 'disabled'">
          <a
            class="page-link"
            href="#"
            @click="paginate(links.next)"
            >&raquo;</a
          >
        </li>
        <li class="page-item" :class="meta.currentPage == meta.totalPages && 'disabled'">
          <a
            class="page-link"
            href="#"
            @click="paginate(links.last)"
            >Last</a
          >
        </li>
      </ul>
    </nav>
    <div v-if="!meta.itemCount" class="fst-italic">
      <hr />
      <p>no game played</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
a {
  color: white;
}
.table-value {
  color: white;
}
.page-item .page-link {
  background-color: transparent !important;
}
.table > :not(caption) > * > * {
  border-bottom-width: 0 !important;
}
.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
  background-color: transparent !important;
}
.pagination > li > a {
  border-width: 0.5px;
}
</style>
