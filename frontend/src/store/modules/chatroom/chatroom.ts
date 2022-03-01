import { defineStore } from "pinia";
import { IChannel, IMessage } from 'shared/models/socket-events';

export interface State {
	rooms : IChannel[];
	messages : IMessage[];
}

export const useChatRoomsStore = defineStore('chatRooms', {
	state : (): State => ({
		rooms: [],
		messages: [],
	}),
	getters: {
		getRooms() : IChannel[] {
			return this.rooms;
		},
		getMessages() : IMessage[] {
			return this.messages;
		},
	},
	actions : {
		fetchRooms(rooms : IChannel[]){
			this.rooms = rooms
		},
		fetchRoom(room : IChannel){
			for (let obj of this.rooms){
				if (obj["roomId"] === room.roomId){
					obj = room;
					return ;
				}
			}
			this.rooms = this.rooms.concat(room);
		},
		addMessage(message : IMessage, roomId: number){
			for (var i = 0; i < this.rooms.length ; i++){
			 	if (this.rooms[i].roomId === roomId){
			 		this.rooms[i].messages = Object.assign(
						this.rooms[i].messages,
						message
					);
			 		break;
			 	}
			}
		},
		leaveChannel(roomId: number, userId: number) {
			let rooms: IChannel[];
				rooms = [];
			for (var i = 0; i < this.rooms.length ; i++)
			if (this.rooms[i].roomId === roomId)
				for (var j = 0; j < this.rooms[i].users.length; j++)
					if (this.rooms[i].users[j]._id === userId){
						delete this.rooms[i].users[j];
						return ;
					}
		}
	}
})