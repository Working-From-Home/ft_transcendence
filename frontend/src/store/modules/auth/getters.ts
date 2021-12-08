import { State } from './type';

export default {
	userID(state: State): string {
		return state.userId;
	},
	token(state: State): string {
		return state.token;
	},
	isAuth(state: State): boolean {
		return !!state.token;
	},
};