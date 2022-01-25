export default {
	initconnectedUsers(state: any, payload: any) {
		console.log('payload.connectedUsers', payload.connectedUsers);
		state.connectedUsers = payload.connectedUsers;
	},
};