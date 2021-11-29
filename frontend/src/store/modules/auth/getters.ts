export default {
	userID(state: any): string {
		return state.userId;
	},
	token(state: any): string {
		return state.token;
	},
	isAuth(state: any): boolean {
		return !!state.token;
	},
};