import { FetchData, FData } from './type';

export default {
	async getProfile(context: any, payload: any) {
		const fetchData: FData = {
			method: 'GET',
			headers: new Headers()
		};
		const newToken: string = 'Bearer ' + payload.token;
		fetchData.headers.append('Authorization', newToken);

		let url: string = 'http://localhost:3000/users/' + payload.id;
		fetch(url, fetchData)
		.then((response) => response.json())
		.then(data => {
			console.log('Success users:', data);
			localStorage.setItem('email', data.email);
			context.commit('initProfile', {
				userId: data.id,
				username: data.username,
				email: data.email,
			});
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
		return context.dispatch('getAvatar', {
			...payload,
		});
	},
	async getAvatar(context: any, payload: any) {
		const fetchData: FData = {
			method: 'GET',
			headers: new Headers()
		};
		const newToken:string = 'Bearer ' + payload.token;
		fetchData.headers.append('Authorization', newToken);

		return context.dispatch('requeteAvatar', {
			...payload,
			fetchData: fetchData,
			url: 'http://localhost:3000/users/' + payload.id + '/avatar'
		});
	},
	async uploadProfile(context: any, payload: any) {
		const formData = new FormData();
        formData.append('image', payload.img)

		const fetchData: FetchData = {
			method: 'PUT',
			body: formData,
			headers: new Headers()
		};
		const newToken: string = 'Bearer ' + payload.token;
		fetchData.headers.append('Authorization', newToken);

		return context.dispatch('requeteAvatar', {
			...payload,
			fetchData: fetchData,
			url: 'http://localhost:3000/users/' + payload.id + '/avatar'
		});
	},
	async deleteAvatar(context: any, payload: any) {
		const fetchData: FData = {
			method: 'DElETE',
			headers: new Headers()
		};
		const newToken: string = 'Bearer ' + payload.token;
		fetchData.headers.append('Authorization', newToken);

		return context.dispatch('requeteAvatar', {
			...payload,
			fetchData: fetchData,
			url: 'http://localhost:3000/users/' + payload.id + '/avatar'
		});
	},
	async requeteAvatar(context: any, payload: any){
		fetch(payload. url, payload.fetchData)
		.then((response) => response.arrayBuffer())
		.then(data => {
			console.log('Success avatar:', data);
			var binary = '';
			var bytes = new Uint8Array(data);
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
				binary += String.fromCharCode(bytes[i]);
			};
			let newAvatar = window.btoa(binary);
			localStorage.setItem('avatar', newAvatar);
			context.commit('initAvatar', {
				avatar: newAvatar,
			});
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	}
};