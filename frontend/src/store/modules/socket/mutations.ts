export default {
	initconnectedUsers(state: any, payload: any) {
		// console.log('payload.connectedUsers', payload.connectedUsers);
		state.connectedUsers = payload.connectedUsers;
	},

	setinGameUsers(state : any, ids : number[]) {
		state.inGameUsers = ids;
		console.log(`in game users: ${state.inGameUsers}`);
	}
};