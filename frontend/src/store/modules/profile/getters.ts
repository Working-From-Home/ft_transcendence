import { State } from './type';

export default {
	myUserId(state: State): string {
		return state.userId;
	},
	myUserName(state: State): string {
		return state.username;
	},
	myEmail(state: State): string {
		return state.email;
	},
	myAvatar(state: State) {
		return state.avatar;
	},
};