<script setup lang="ts">
import ChatService from '@/services/ChatService';
import { toNumber } from '@vue/shared';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useNotificationsStore } from '@/store/notifications';

const router = useRouter();
const notificationsStore = useNotificationsStore();

const username = ref<string>('');
const results = ref<any>([]);

function searchUsers() {
  results.value = [];
  ChatService.searchUsers(username.value).then((resp: any) => {
    for (const obj of resp) {
      if (obj.id != toNumber(localStorage.getItem('userId')))
        results.value.push(obj);
    }
  });
}

function goToUserProfile() {
  if (!username.value) {
    return notify('info', 'instructions for use', 'Please enter a username before clicking on search');
  }
  let res = JSON.parse(JSON.stringify(results.value));
  for (const user of res) {
    if (user.username === username.value) {
      username.value = '';
      router.push('/users/' + user._id);
      return;
    }
  }
  notify('danger', 'not found', 'This user does not exist');
}

function notify(type: string, header: string, body: string) {
  username.value = '';
  notificationsStore.enqueue(type, header, body);
}
</script>

<template>
  <form class="mx-auto d-flex ms-lg-3 my-3 my-lg-0" @submit.prevent="goToUserProfile">
    <input
      v-model="username"
      @input="searchUsers"
      class="form-control me-1 bg-body border-secondary"
      type="search"
      list="ids"
      placeholder="search for a user"
      aria-label="search for a user"
    />
    <datalist id="ids">
      <option v-for="result in results" :key="result._id">
        {{ result.username }}
      </option>
    </datalist>
    <button
      id="searchButton"
      class="btn btn-outline-secondary"
      type="submit"
    >
      Search
    </button>
  </form>
</template>

<style lang="scss" scoped></style>
