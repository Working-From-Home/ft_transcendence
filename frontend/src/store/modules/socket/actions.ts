export default {
	initconnectedUsers(context: any, payload: any) {
		//console.log('Action payload', payload)
		context.commit('initconnectedUsers', {
			connectedUsers: payload,
		})
	},
};