import { defineStore } from "pinia";
import { IChannel, IMessage } from 'shared/models/socket-events';

export interface State {
	rooms : IChannel[];
	messages : IMessage[];
	isAdmin: boolean;
	isOwner: boolean;
	isMute: boolean;
	isban: boolean;
}

export const useChatRoomsStore = defineStore('chatRooms', {
	state : (): State => ({
		rooms: [],
		messages: [],
		isAdmin: false,
		isOwner: false,
		isMute: false,
		isban: false,
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
		fetchRoom(room : IChannel[]){
			for (let obj of this.rooms){
				if (obj["roomId"] === room[0].roomId){
					obj = room[0];
					return ;
				}
			}
			this.rooms = room.concat(this.rooms);
		},
		fetchMessage(messages: IMessage[]){
			this.messages = messages;
		},
		addMessage(messages: IMessage[]){
			this.messages = this.messages.concat(messages);
		},
		leaveChannel(channelId: number) {
			let i = 0;
			for (let obj of this.rooms){
				if (obj["roomId"].valueOf() == channelId){
					this.rooms.splice(i, 1);
					return ;
				}
				i++;
			}
		}
	}
})