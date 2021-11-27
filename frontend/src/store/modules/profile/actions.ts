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
			})
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
			//var objectURL = URL.createObjectURL(data);
			console.log('Success avatar:', data);
		}).catch(error => {
			console.error('Error:', error);
			throw error;
		});
	}
};