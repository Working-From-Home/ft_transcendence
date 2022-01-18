export default {
	fetchRooms(state: any, payload: any){
		state.rooms = payload.rooms;
	},
	addMessage(state: any, payload: any){
		let newMessage = payload.newMessage;
		for (var i = 0; i < state.rooms ; i++){
			if (state.rooms[i].roomId === payload.roomId){
				state.rooms[i].messages = {
					...state.rooms[i].messages,
					newMessage
				};
				break;
			}
		}
	},
	leaveChannel(state: any, payload: any){
		for (var i = 0; i < state.rooms.length ; i++)
			if (state.rooms[i].roomId === payload.roomId)
				for (var j = 0; j < state.rooms[i].users.length; j++)
					if (state.rooms[i].users[j]._id === payload.userId){
						delete state.rooms[i].users[j];
						return ;
					}
	}
};