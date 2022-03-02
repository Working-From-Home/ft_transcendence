import { State } from './types';

export default {
	initProfile(state: State, payload: any) {
		state.userId = payload.userId;
		state.username = payload.username;
		state.email = payload.email;
		state.level = payload.level;
		state.victories = payload.victories;
		state.losses = payload.losses;
	},
	initStats(state: State, payload: any) {
		state.level = payload.level;
		state.victories = payload.victories;
		state.losses = payload.losses;
	},
	initAvatar(state: State, payload: any) {
		state.avatar = payload.avatar;
	}
}