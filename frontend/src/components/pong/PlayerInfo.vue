<template>
	<div class="d-flex flex-column align-items-center">
		<img :src="userAvatar" alt="avatar" height="40" class="mb-3">
		<h6 v-if="small">{{ username }}</h6>
		<h4 v-else>{{ username }}</h4>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "@/services/UserService";
import { IUser } from "@/models/IUser";

export default defineComponent({
	props: {
		userId: {type: Number, required: true},
		small : {type: Boolean, required: false},
	},
	data() {
		return {
			user : {} as IUser,
			avatar : "",
			canvas : {} as HTMLCanvasElement
		}
	},
	async mounted () {
		if (this.userId && this.userId !== 0) {
				const userResp = await UserService.getUserById(this.userId);
				this.user = userResp.data;
				this.avatar = await UserService.getAvatarOfUser(this.userId);
		}
	},
	computed: {
		userAvatar() : string {
			return this.avatar;
		},
		username() {
			return this.user.username;
		}
	},
	watch: {
		async userId(newId, oldId) {
			if (newId && newId !== 0) {
				const userResp = await UserService.getUserById(newId);
				this.user = userResp.data;
				this.avatar = await UserService.getAvatarOfUser(newId);
			}
		}
  }
})

</script>

<style></style>