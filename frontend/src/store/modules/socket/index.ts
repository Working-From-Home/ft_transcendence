import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default ({
	state() {
		return {
			connectedUsers: [],
			inGameUsers: [] as number[]
		};
	},
	mutations,
	actions,
	getters
});
