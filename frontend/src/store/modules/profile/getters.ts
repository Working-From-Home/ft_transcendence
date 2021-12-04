export default {
	myUserId(state: any): string {
		return state.userId;
	},
	myUserName(state: any): string {
		return state.username;
	},
	myEmail(state: any): string {
		return state.email;
	},
	myAvatar(state: any) {
		return state.avatar;
	},
};