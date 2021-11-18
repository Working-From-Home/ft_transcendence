import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default ({
	state() {
		return {
			users: [
				{
					id: 'user1',
					pseudo: 'alesanto',
					avatar: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages4.wikia.nocookie.net%2F__cb20121112232638%2Fcandh%2Fimages%2F3%2F36%2F61D_hobbes.jpg&f=1&nofb=1',
				},
			]
		};
	},
	mutations,
	actions,
	getters
});
