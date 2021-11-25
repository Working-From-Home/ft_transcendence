export default {
	signIn(state: any, payload: any) {
		state.token = payload.token;
		state.userId = payload.userId;
		state.tokenExpiration = payload.tokenExpiration;
	},
};