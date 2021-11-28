export default {
	userID(state: any): string {
		return state.userID;
	},
	token(state: any): string {
		return state.token;
	},
	isAuth(state: any): boolean {
		console.log('test: ', state.token);
		return !!state.token;
	},
};