export default {
	async getProfile(context: any, payload: any) {
		let url = 'http://localhost:3000/users/' + payload.id;
		fetch(url)
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
		const fetchData = {
			method: 'GET',
			headers: new Headers()
		};
		const newToken = 'Bearer ' + payload.token;
		fetchData.headers.append('Authorization', newToken);
		let url = 'http://localhost:3000/users/' + payload.id + '/avatar';
		fetch(url, fetchData)
		.then((response) => response.blob())
		.then(data => {
			console.log('Success avatar:', data);
			localStorage.setItem('avatar', URL.createObjectURL(data));
			context.commit('initAvatar', {
				avatar: URL.createObjectURL(data),
			});
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	},
	async uploadProfile(context: any, payload: any) {
		console.log('1 avatar:', payload.img);
		console.log('2 avatar:', JSON.stringify(payload.img));
		const fetchData = {
			method: 'POST',
			body: payload.img,
			headers: new Headers()
		};
		const newToken = 'Bearer ' + payload.token;
		fetchData.headers.append('Content-Type', 'png');
		fetchData.headers.append('Authorization', newToken);
		let url = 'http://localhost:3000/users/' + payload.id + '/avatar';
		fetch(url, fetchData)
		.then((response) => response.json())
		.then(data => {
			console.log('Success upload avatar:', data);
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
		return context.dispatch('getAvatar', {
			...payload,
		});
	}
};