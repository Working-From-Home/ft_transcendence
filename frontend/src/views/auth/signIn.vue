<template>
	<div>
		<base-dialog :show="!!error" title="An error ocured" @close="handleError">
			<p>{{ error }}</p>
		</base-dialog>
		<card>
			<h1>Sign In</h1>
			<sign-in-component @save-data="saveData"></sign-in-component>
		</card>
	</div>
</template>

<script lang="ts">
import { useAuthStore } from "@/store/modules/auth/auth";
import { defineComponent } from "vue";
import SignInComponent from "../../components/auth/SignIn.vue";

interface State {
  error: string | null;
}

export default defineComponent({
	components: {
		SignInComponent,
	},
	data: (): State => {
		return {
			error: ''
		};
	},
	setup() {
		const authStore = useAuthStore();
		return { authStore };
	},
  methods: {
    async saveData(data: {username: string, password: string}) {
			try {
				const err = await this.authStore.signIn(data.username, data.password);
				if (err)
					this.error = err.message;
				else
					this.$router.replace('/');
			} catch (err: any) {
				this.error = 'Opps, Something went very wrong';
	  	}
    },
    switchAuthMode() {
		this.$router.replace('auth/signup');
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