<template>
	<base-button @click="openModal">
		<base-dialog :show="!!open" title="Delete Account" @close="closeModal">
			<p>Are you sure you want to delete your account?</p>
			<base-button class="red" @click="deleteUser">Yes</base-button>
		</base-dialog>
		<p>Delete your account</p>
	</base-button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseButton from "../ui/BaseButton.vue";

@Options({
  components: { BaseButton },
  data() {
		return {
			open: false,
		};
	},
  methods: {
	  async deleteUser() {
		  const formData = {
			userId: this.$store.getters.userID,
			token: this.$store.getters.token,
		};
		await this.$store.dispatch('deleteUser', formData);
		this.$store.dispatch('logout');
		this.$router.replace('/');
	  },
	  openModal() {
		  this.open = true;
	  },
	  closeModal() {
		  this.open = false;
	  }
  },
})
export default class ButtonDel extends Vue {

}
</script>

<style scoped>
.red {
	width: 30%;
	background-color: red;
	border-color: #be0606;
	position: absolute;
	bottom: 7%;
}
</style>