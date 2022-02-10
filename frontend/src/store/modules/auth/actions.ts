import { UserLog, UserUp, FetchData } from './type';
import http from '@/http'
import axios, { AxiosError } from 'axios';

let timer: number;

interface AuthResp
{
	id: number;
	access_token: string;
}

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
	// async auth(context: any, payload: any) {
	// 	let url: string = '/auth/signup';
	// 	if (payload.mode === 'signIn')
	// 		url = '/auth/signin';

	// 	http.post<AuthResp>(url, payload)
	// 	.then( resp  => {
	// 		console.log('axios success:', resp);

	// 		const expiration: number = new Date().getTime() + 3600000;
	// 		localStorage.setItem('token', resp.data.access_token);
	// 		localStorage.setItem('userId', resp.data.id.toString());
	// 		localStorage.setItem('username', payload.username);
	// 		localStorage.setItem('tokenExpiration', expiration.toString());
	// 		timer = setTimeout(function() {
	// 			context.dispatch('logout');
	// 		}, 3600000);

	// 		context.commit('signIn', {
	// 			token: resp.data.access_token,
	// 			userId: resp.data.id
	// 		})
			
	// 		context.dispatch('getProfile', {
	// 			...payload,
	// 			id: resp.data.id,
	// 			token: resp.data.access_token
	// 		});
	// 		return resp.data;
	// 	})
	// 	.catch( (err: Error | AxiosError) =>
	// 	{
	// 		if (axios.isAxiosError(err))  {
	// 			console.log("type AxiosError:",err.response?.data);
	// 			return new Promise( reject =>
	// 				{
	// 				reject(err.response?.data)
	// 			})
	// 			} else {
	// 			console.log("type Error:",err);
	// 			throw new Error(err.message)
	// 		}
	// 	})
	// },
	async auth(context: any, payload: any) {
		let url: string = 'http://localhost:3000/auth/signup';
		if (payload.mode === 'signIn')
			url = 'http://localhost:3000/auth/signin';

		const fetchData: FetchData = {
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

			const expiration: number = new Date().getTime() + 3600000;
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
		const token: string | null = localStorage.getItem('token');
		const userId: string | null = localStorage.getItem('userId');
		const username: string | null = localStorage.getItem('username');
		const email: string | null = localStorage.getItem('email');
		const avatar: string | null = localStorage.getItem('avatar');
		const tokenExpiration: string | null = localStorage.getItem('tokenExpiration');

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
	},
	deleteUser(context: any, payload: any) {
		let url:string = 'http://localhost:3000/users/' + payload.userId;
		const fetchData: FetchData = {
			method: 'DELETE',
			body: '',
			headers: new Headers()
		};
		const newToken: string = 'Bearer ' + payload.token;
		fetchData.headers.append('Authorization', newToken);
		fetch(url, fetchData)
		.then((response) => response.json())
		.then(data => {
			console.log('Success delete:', data);
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	}
};