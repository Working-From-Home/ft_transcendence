<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth/auth';
import ButtonDel from './ButtonDel.vue';
import http from '@/http';

const authStore = useAuthStore();
const route = useRoute();
const fileInput = ref<HTMLInputElement>();
const avatar = ref<string>('');

const isMine = computed<boolean>(() => route.path === '/profile');
const base64 = computed<string>(() => 'data:image/png;base64,' + avatar.value);

let url: string = process.env.VUE_APP_BACKEND_SERVER_URI + '/users/';
url += route.path === '/profile' ? authStore.userId : route.params.userid;
url += '/avatar';

http
  .get(url, { responseType: 'arraybuffer' })
  .then(
    (response) => (
			avatar.value = formatImage(response.data)
    )
  );

function uploadFile() {
	fileInput.value?.click();
}

function formatImage(data: ArrayBuffer) {
	var binary = '';
	var bytes = new Uint8Array(data);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++)
		binary += String.fromCharCode(bytes[i]);
	let newAvatar = window.btoa(binary);
	return newAvatar;
}

function uploadAvatar(event: any) {
	const formData = new FormData();
	formData.append('image', event.target.files[0]);
	http
		.put(url, formData, { responseType: 'arraybuffer' })
		.then(
			(response) => (
				avatar.value = formatImage(response.data)
			)
		)
}

function restoreAvatar() {
	http
		.delete(url)
		.then(
			(response) => (
				avatar.value = formatImage(response.data)
			)
		)
}

</script>

<template>
	<div class="image-wrapper m-auto" :class="isMine && 'clickable'" @click="uploadFile">
		<img
			:src="base64"
			class="img-fluid rounded-start cropped"
			alt="avatar"
		/>
		<input
			v-if="isMine"
			type="file"
			style="display: none"
			ref="fileInput"
			accept="image/*"
			name="uploaded_file"
			@change="uploadAvatar"
		/>
	</div>
	<button @click="restoreAvatar">remove</button>
</template>

<style scoped>
.image-wrapper {
  width: 18vw;
  height: 18vw;
  overflow: none;
}

.clickable {
  cursor: pointer;
}

.cropped {
  /* object-fit: none; Do not scale the image */
  object-position: center;
  width: 100%;
  width: 100%;
}
</style>