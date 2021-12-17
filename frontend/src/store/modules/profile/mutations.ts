import { State } from './type';

export default {
	initProfile(state: State, payload: any) {
		state.userId = payload.userId;
		state.username = payload.username;
		state.email = payload.email;
	},
	initAvatar(state: State, payload: any) {
		state.avatar = payload.avatar;
	}
}