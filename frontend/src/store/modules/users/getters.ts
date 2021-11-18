export default {
	users(state: any) {
		return state.users;
	},
	hasUsers(state: any) {
		return state.users && state.users.length > 0;
	}
};