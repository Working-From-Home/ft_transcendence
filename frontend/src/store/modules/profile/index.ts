import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
	state() {
		return {
			userId: null,
			username: null,
			email: null,
			avatar: null,
			level: 0,
			victories: 0,
			losses: 0
		};
	},
	mutations,
	actions,
	getters
};
