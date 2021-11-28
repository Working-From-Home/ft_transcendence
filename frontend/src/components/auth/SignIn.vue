<template>
	<form @submit.prevent="submitForm">
		<div class="form-control" :class="{invalid: !username.isValid}">
			<label for="username">Username</label>
			<input type="text" id="username" v-model.trim="username.val" @blur="clearValidity('username')"/>
			<p v-if="!username.isValid">Username must not be empty.</p>
		</div>
		<div class="form-control" :class="{invalid: !password.isValid}" >
			<label for="password">Password</label>
			<input type="text" id="password" v-model.trim="password.val" @blur="clearValidity('password')"/>
			<p v-if="!password.isValid">Password must not be empty.</p>
		</div>
		<p v-if="!formIsValid">Please enter a valid username and password.</p>
		<base-button>Login</base-button>
		<base-button type="button" mode="flat" @click="switchAuthMode">Signup instead</base-button>
	</form>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	emits: ['save-data'],
	data() {
		return {
			username: {
				val: '',
				isValid: true
			},
			password: {
				val: '',
				isValid: true
			},
			formIsValid: true,
		};
	},
  methods: {
	clearValidity(input: string) {
		this[input].isValid = true;
	},
	validateForm() {
		this.formIsValid = true;
		if (this.username.val === '') {
			this.username.isValid = false;
			this.formIsValid = false;
		}
		if (this.password.val === '') {
			this.password.isValid = false;
			this.formIsValid = false;
		}
	},
    async submitForm() {
		this.validateForm();

		if (!this.formIsValid)
			return;

		const formData = {
			username: this.username.val,
			password: this.password.val,
		};
		await this.$emit('save-data', formData);
	},
    switchAuthMode() {
		this.$router.replace('auth/signup');
    }
  },
})
export default class SignIn extends Vue {
	
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