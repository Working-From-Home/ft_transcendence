export default {
	async signIn(context: any, payload: any) {
		const user = {
			username: String,
			password: String
		};
		user.username = payload.username;
		user.password = payload.password;

		const fetchData = {
			method: 'POST',
			body: JSON.stringify(user),
			headers: new Headers()
		};
		fetchData.headers.append('Content-Type', 'Application/json');

		fetch(`http://localhost:3000/auth/signin`, fetchData)
		.then((response) => response.json())
		.then(data => {
			console.log('Success:', data);
			context.commit('signIn', {
				token: data.access_token,
				userId: user.username,
				tokenExpiration: "100",
			})
			return data;
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	},
	async signUp(context: any, payload: any) {
		const user = {
			email: String,
			username: String,
			password: String
		};
		user.username = payload.username;
		user.email = payload.email;
		user.password = payload.password;

		const fetchData = {
			method: 'POST',
			body: JSON.stringify(user),
			headers: new Headers()
		};
		fetchData.headers.append('Content-Type', 'Application/json');

		fetch(`http://localhost:3000/auth/signup`, fetchData)
		.then((response) => response.json())
		.then(data => {
			console.log('Success:', data);
			context.commit('signIn', {
				token: data.access_token,
				userId: user.username,
				tokenExpiration: "100",
			})
			return data;
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	},
	logout(context: any) {
		context.commit('signIn', {
			token: null,
			userId: null,
			tokenExpiration: null,
		})
		console.log('Token:', context.token);
	},
};