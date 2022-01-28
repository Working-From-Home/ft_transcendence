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
import { Options, Vue } from "vue-class-component";
import SignUpComponent from "../../components/auth/SignUp.vue";

interface State {
  error: string;
}

@Options({
  components: {
    SignUpComponent,
  },
  data: (): State => {
	  return {
		  error: '',
	  }
  },
  methods: {
    async saveData(data: any) {
	  try {
        await this.$store.dispatch('signUp', data);
        this.$router.replace('/');
	  } catch (err) {
		console.log('Sign Up Do i land here:');
		this.error = err.message || 'Failed to authenticate, try later.';
	  }
    },
	handleError() {
		this.error = null;
	}
  },
})
export default class signUp extends Vue {
	
}
</script>

<style scoped>

.card {
	background-color: #192531;
	box-shadow: none;
	max-width: 20rem;
	border: none;
}

</style>