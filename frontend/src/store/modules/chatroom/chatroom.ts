import { defineStore } from "pinia";
import { IChannel, IMessage } from 'shared/models/socket-events';
import { toNumber } from '@vue/shared';

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
		getIsMute(): boolean {
			return this.isMute;
		}
	},
	actions : {
		fetchRooms(rooms : IChannel[]){
			this.rooms = rooms
		},
		fetchRoom(room : IChannel[]){
			for (let obj of room[0].users){
				if (obj._id === toNumber(localStorage.getItem('userId'))){
					if (obj.bannedUntil != null)
						return ;
				}
			}
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
		addMessageCurrent(messages: IMessage[], channelId: number){
			for (let obj of this.rooms){
				if (obj["roomId"] === channelId){
					if (obj.messages)
						obj.messages = obj.messages.concat(messages);
					else
						obj.messages = messages;
					this.messages = obj.messages;
					return ;
				}
			}
		},
		addParam(param: string, channelId: number, userId: number, content: Date | null) {
			for (let obj of this.rooms){
				if (obj.roomId.toString() === channelId.toString()){
					for (let user of obj.users) {
						if (user._id.toString() === userId.toString()){
							if (param === "mute"){
								user.mutedUntil = content;
								this.isMute = true;
							}
							else if (param === "ban")
								this.leaveChannel(channelId)
							else if (param === "unmute"){
								user.mutedUntil = null;
								this.isMute = false;
							}
							else if (param === "unban")
								user.mutedUntil = null;
							else if (param === "admin")
								user.isAdmin = true;
							return ;
						}
					}
				}
			}
		},
		leaveChannel(channelId: number) {
			let i = 0;
			for (let obj of this.rooms){
				if (obj["roomId"].toString() === channelId.toString()){
					this.rooms.splice(i, 1);
					return ;
				}
				i++;
			}
		}
	}
})