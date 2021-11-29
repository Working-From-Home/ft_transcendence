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
		const fetchData = {
			method: 'GET',
			headers: new Headers()
		};
		const newToken = 'Bearer ' + payload.token;
		fetchData.headers.append('Authorization', newToken);
		url += '/avatar';
		fetch(url, fetchData)
		.then((response) => response.blob())
		.then(data => {
			console.log('Success avatar:', data);
			localStorage.setItem('avatar', URL.createObjectURL(data));
			context.commit('initAvatar', {
				avatar: URL.createObjectURL(data),
			})
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	}
};