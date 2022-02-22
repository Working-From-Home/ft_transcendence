<template>
	<div>
		<base-dialog :show="!!error" title="An error ocured" @close="handleError">
			<p>{{ error }}</p>
		</base-dialog>
		<card>
			<h1>Sign Up</h1>
			<sign-up-component @save-data="saveData"></sign-up-component>
		</card>
	</div>
</template>

<script lang="ts">
import { useAuthStore } from "@/store/modules/auth/auth";
import { defineComponent } from "vue";
import SignUpComponent from "../../components/auth/SignUp.vue";

interface State {
  error: string | null;
}

export default defineComponent({
  components: {
    SignUpComponent,
  },
	setup() {
		const authStore = useAuthStore();

		return { authStore };
	},
  data: (): State => {
	  return {
		  error: '',
	  }
  },
  methods: {
    async saveData(data: any) {
			try {
				const err = await this.authStore.signUp(data.username, data.email, data.password);
				if (err)
					this.error = err.message;
				else
					this.$router.replace('/');
			} catch (err: any) {
				this.error = 'Opps, Something went very wrong';
	  	}
    },
	handleError() {
		this.error = null;
	}
  },
})
</script>

<style scoped>

.card {
	background-color: #192531;
	box-shadow: none;
	max-width: 20rem;
	border: none;
}

</style>