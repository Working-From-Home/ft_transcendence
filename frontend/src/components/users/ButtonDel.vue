<template>
	<base-button type="button" data-bs-toggle="modal" data-bs-target="#myModal"  mode="flat">
		<div class="modal fade" id="myModal">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">Delete your account</h4>
						<button type="button" class="btn-close" data-bs-dismiss="modal"></button>
					</div>
					<div class="modal-body">
						<p>Are you sure you want to delete your account?</p>
					</div>
					<div class="modal-footer">
						<base-button type="button" class="btn red" @click="deleteUser">Yes</base-button>
					</div>
				</div>
			</div>
		</div>
		<p>Delete your account</p>
	</base-button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseButton from "../ui/BaseButton.vue";

interface State {
  open: boolean
}

@Options({
  components: { BaseButton },
  data: (): State => {
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
}
</style>