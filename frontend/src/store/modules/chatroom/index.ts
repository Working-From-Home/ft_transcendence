import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import { IChannel, Message } from 'shared/models/socket-events';
export default ({
	state() {
		return {
			rooms: [] as IChannel[],
			messages: [],
		};
	},
	mutations,
	actions,
	getters
});
