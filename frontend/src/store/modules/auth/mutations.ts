import { State } from './type';

export default {
	signIn(state: State, payload: {token: string, userId: string}) {
		state.token = payload.token;
		state.userId = payload.userId;
	},
};