<template>
	<div>
		<img :src="userAvatar" alt="" width="40" class="me-3 d-inline-block align-text-top">
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
	async mounted() {
		console.log(`mounted id: ${this.userId}`);
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