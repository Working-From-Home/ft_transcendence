<template>
<div>
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
		<base-button class="login">Login</base-button>
	</form>
	<base-button class="redirect" type="button" mode="flat" @click="switchAuthMode">Signup instead</base-button>
</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

interface State {
  username: { val: string, isValid: boolean },
  password: { val: string, isValid: boolean },
  formIsValid: boolean
}

@Options({
	emits: ['save-data'],
	data: (): State => {
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
		this.$router.push('/auth/signup');
    }
  },
})
export default class SignIn extends Vue {
	
}
</script>


<style scoped>
form {
  margin: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.884);
  
  border-radius: 12px;
  padding: 1rem;
  background-color: #2c3e50;
}

.form-control {
  margin: 0.5rem 0;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.884);
  border: none;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.redirect {
	color: #42b983;
}

.login {
	width: 100%;
	padding: 5px;
	margin-top: 10px;
	border-radius: 0.3em;
	text-align: center;
	background-color: #42b983;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
  background-color: #2c3e50;
  border-radius: 0.3em;
  margin: -2px;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>