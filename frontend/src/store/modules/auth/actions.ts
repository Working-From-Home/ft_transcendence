import { UserLog, UserUp } from './type';

export default {
	async signIn(context: any, payload: UserLog) {
		context.dispatch('auth', {
			...payload,
			mode: 'signIn'
		});
	},
	async signUp(context: any, payload: UserUp) {
		context.dispatch('auth', {
			...payload,
			mode: 'signUp'
		});
	},
	async auth(context: any, payload: any) {
		let url = 'http://localhost:3000/auth/signup';
		if (payload.mode === 'signIn')
			url = 'http://localhost:3000/auth/signin';

		const fetchData = {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: new Headers()
		};
		fetchData.headers.append('Content-Type', 'Application/json');

		fetch(url, fetchData)
		.then((response) => response.json())
		.then(data => {
			console.log('Success:', data);

			const expiration = new Date().getTime() + 3600;
			localStorage.setItem('token', data.access_token);
			localStorage.setItem('userId', payload.username);
			localStorage.setItem('tokenExpiration', expiration.toString());

			context.commit('signIn', {
				token: data.access_token,
				userId: payload.username
			})
			return data;
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	},
	checkLog(context: any) {
		const token = localStorage.getItem('token');
		const userId = localStorage.getItem('userId');

		if (token && userId) {
			context.commit('signIn', {
				token: token,
				userId: userId,
				tokenExpiration: "3600",
			});
		}
	},
	logout(context: any) {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		context.commit('signIn', {
			token: null,
			userId: null
		})
		console.log('Token:', context.token);
	},
};