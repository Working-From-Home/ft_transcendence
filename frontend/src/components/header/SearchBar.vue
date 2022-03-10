<script setup lang="ts">
import ChatService from '@/services/ChatService';
import { toNumber } from '@vue/shared';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const props = defineProps({
  list: {
    type: String,
    required: true,
  },
});

const userName = ref<string>('');
const results = ref<any>([]);
const errorMessage = ref<string>('');
const show = ref<boolean>(false);

function search() {
  show.value = true;
}

function searchUsers() {
	results.value = [];
	ChatService.searchUsers(userName.value).then((resp: any) => {
		console.log("RESP =",resp);
		for (const obj of resp) {
			if (obj.id != toNumber(localStorage.getItem('userId')))
				results.value = results.value.concat(obj);
		}
		console.log("RES =", results.value);
	});
}

function goToUserProfile() {
  if (!userName.value) {
    errorMessage.value = 'Enter a username before clicking on search';
    return;
  }
  let res = JSON.parse(JSON.stringify(results.value));
  for (const user of res) {
    if (user.username === userName.value) {
    	router.push('/users/' + user._id);
      return;
    }
  }
  errorMessage.value = 'This user does not exist';
}

function clearErrorMessage() {
  errorMessage.value = '';
}
</script>

<template>
  <!-- input -->

  <form class="mx-auto d-flex my-3 my-lg-0" @submit.prevent="goToUserProfile">
    <input
      v-model="userName"
      @input="searchUsers()"
      class="form-control me-1"
      type="search"
      :list="list"
      placeholder="search for a user"
      aria-label="search for a user"
    />
    <datalist :id="list">
			<option v-for="result in results" :key="result._id">
				{{ result.username }}
			</option>
    </datalist>
    <button class="btn btn-outline-success" type="submit">Search</button>
  </form>

  <!-- alert -->

  <div class="position-absolute top-50 start-50 translate-middle mt-5">
    <div
      v-if="errorMessage"
      style="z-index: 1000 !important"
      class="alert alert-warning alert-dismissible fade show mt-5"
      role="alert"
    >
      <p class="mb-0">{{ errorMessage }}</p>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="clearErrorMessage"
      ></button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input::-webkit-calendar-picker-indicator {
  position: absolute;
  opacity: 0;
}

datalist > option {
  width: 100%;
}
</style>
