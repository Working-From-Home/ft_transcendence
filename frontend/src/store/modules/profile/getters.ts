import { State } from './types';

export default {
	// isMine(state: State): boolean {
	// 	return state.isMine;
	// },
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
	myLevel(state: State) {
		return state.level;
	},
	myVictories(state: State) {
		return state.victories;
	},
	myLosses(state: State) {
		return state.losses;
	},
};