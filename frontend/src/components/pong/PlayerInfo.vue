<template>
	<div class="d-flex justify-content-evenly">
		<div class="d-flex justify-content align-items-center">
			<h3 v-if="side === 'right'" class="px-1">{{ username }}</h3>
			<img :src="userAvatar" alt="avatar of user" height="50" class="px-1">
			<h3 v-if="side === 'left'" class="px-1">{{ username }}</h3>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserService from "@/services/UserService";
import { IUser } from "@/models/IUser";

export default defineComponent({
	props: {
		userId: {type: Number, required: true},
		side : {type: String, required: true},
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

<style>
</style>