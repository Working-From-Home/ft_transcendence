<template>
	<div class="d-flex justify-content-evenly">
		<div class="d-flex justify-content align-items-center">
			<h3 v-if="side === 'right'" class="px-1">{{user.username}}</h3>
			<img :src="userAvatar" alt="avatar of user" height="50" class="px-1">
			<h3 v-if="side === 'left'" class="px-1">{{user.username}}</h3>
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
		score : {type: Number, required: true}
	},
	data() {
		return {
			user : {} as IUser,
			avatar : "",
			canvas : {} as HTMLCanvasElement
		}
	},
	async mounted() {
		const userResp = await UserService.getUserById(this.userId);
		this.user = userResp.data;
		this.avatar = await UserService.getAvatarOfUser(this.userId);
	},
	computed: {
		userAvatar() : string {
			return 'data:image/png;base64,' + this.avatar;
		}
	}
})

</script>

<style>
</style>