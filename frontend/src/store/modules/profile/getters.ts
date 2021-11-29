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
	myAvatarId(state: any) {
		return state.avatarId;
	},
	myAvatar(state: any) {
		return state.avatar;
	},
};