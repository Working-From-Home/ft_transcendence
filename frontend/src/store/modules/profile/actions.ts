export default {
	async getProfile(context: any, payload: any) {
		let url = 'http://localhost:3000/users/' + payload.id;
		fetch(url)
		.then((response) => response.json())
		.then(data => {
			console.log('Success users:', data);
			context.commit('initProfile', {
				userId: data.id,
				username: data.username,
				email: data.email,
				avatarId: data.avatarId,
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
		console.log('url:', url);
		console.log('token:', payload.token);
		console.log('fetchData:', fetchData);
		fetch(url, fetchData)
		.then((response) => response.blob())
		.then(data => {
			context.commit('initAvatar', {
				avatar: URL.createObjectURL(data),
			})
			avatar: URL.createObjectURL(data);
			console.log('Success avatar:', data);
			console.log('Success url avatar:', URL.createObjectURL(data));
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	}
};