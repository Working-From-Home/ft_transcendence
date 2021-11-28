<template>
	<div>
		<base-dialog :show="!!error" title="An error ocured" @close="handleError">
			<p>{{ error }}</p>
		</base-dialog>
		<card>
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
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>