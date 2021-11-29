import { UserLog, UserUp } from './type';
let timer: any;

export default {
	async signIn(context: any, payload: UserLog) {
		return context.dispatch('auth', {
			...payload,
			mode: 'signIn'
		});
	},
	async signUp(context: any, payload: UserUp) {
		return context.dispatch('auth', {
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
		await fetch(url, fetchData)
		.then((response) => {
			if (!response.ok)
				throw new Error('Failed to authenticate. Check your login data.');
			return response.json();
		})
		.then(data => {
			console.log('Success:', data);

			const expiration = new Date().getTime() + 3600000;
			localStorage.setItem('token', data.access_token);
			localStorage.setItem('userId', data.id);
			localStorage.setItem('username', payload.username);
			localStorage.setItem('tokenExpiration', expiration.toString());
			timer = setTimeout(function() {
				context.dispatch('logout');
			}, 3600000);

			context.commit('signIn', {
				token: data.access_token,
				userId: data.id
			})
			
			context.dispatch('getProfile', {
				...payload,
				id: data.id,
				token: data.access_token
			});
			return data;
		}).catch(error => {
			throw error.message;
		});
	},
	checkLog(context: any) {
		const token = localStorage.getItem('token');
		const userId = localStorage.getItem('userId');
		const username = localStorage.getItem('username');
		const email = localStorage.getItem('email');
		const avatar = localStorage.getItem('avatar');
		const tokenExpiration = localStorage.getItem('tokenExpiration');

		if (token && userId) {
			context.commit('signIn', {
				token: token,
				userId: userId
			});
			context.commit('initProfile', {
				username: username,
				userId: userId,
				email: email,
			});
			context.commit('initAvatar', {
				avatar: avatar
			});
		}
	},
	logout(context: any) {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('tokenExpiration');
		localStorage.removeItem('username');
		localStorage.removeItem('email');
		localStorage.removeItem('avatar');

		clearTimeout(timer);

		context.commit('signIn', {
			token: null,
			userId: null
		})
		console.log('Token:', context.token);
	},
};