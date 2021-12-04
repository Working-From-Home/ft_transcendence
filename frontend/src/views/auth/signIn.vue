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
import { Options, Vue } from "vue-class-component";
import SignInComponent from "../../components/auth/SignIn.vue";

@Options({
	components: {
		SignInComponent,
	},
	data() {
		return {
			error: ''
		};
	},
  methods: {
    async saveData(data: any) {
	  try {
        await this.$store.dispatch('signIn', data);
        this.$router.replace('/');
	  } catch (err) {
		this.error = err.message || 'Failed to authenticate, try later.';
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
export default class signIn extends Vue {
	
}
</script>


<style scoped>
.card {
	background-color: #192531;
	box-shadow: none;
	max-width: 20rem;
}
</style>