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
		leaveChannel(channelId: number) {
			let i = 0;
			for (let obj of this.rooms){
				if (obj["roomId"] === channelId){
					this.rooms.splice(i, 1);
					return ;
				}
				i++;
			}
		}
	}
})