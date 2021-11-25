export default {
	userID(state: any) {
		return state.userID;
	},
	token(state: any) {
		return state.token;
	},
	isAuth(state: any) {
		console.log('test: ', state.token);
		return !!state.token;
	},
};