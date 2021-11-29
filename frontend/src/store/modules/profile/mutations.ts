export default {
	initProfile(state: any, payload: any) {
		state.userId = payload.userId;
		state.username = payload.username;
		state.email = payload.email;
	},
	initAvatar(state: any, payload: any) {
		state.avatar = payload.avatar;
	}
}