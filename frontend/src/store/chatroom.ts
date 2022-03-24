import { defineStore } from "pinia";
import { IChannel, IMessage, IBlocked } from 'shared/models/socket-events';
import { useCurrentUserStore } from '@/store/currentUser';

export interface State {
	rooms : IChannel[];
	messages : IMessage[];
	isAdmin: boolean;
	isOwner: boolean;
	isMute: boolean;
	isban: boolean;
	blockList: IBlocked[]; 
}

export const useChatRoomsStore = defineStore('chatRooms', {
	state : (): State => ({
		rooms: [],
		messages: [],
		isAdmin: false,
		isOwner: false,
		isMute: false,
		isban: false,
		blockList: [],
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
		},
		getblock(): IBlocked[] {
			return this.blockList;
		}
	},
	actions : {
		fetchRooms(rooms : IChannel[]){
			this.rooms = rooms
		},
		fetchRoom(room : IChannel[]){
			for (let obj of room[0].users){
				if (obj._id === useCurrentUserStore().userId){
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
			for (let message of messages) {
				for (const obj of this.blockList) {
					if (obj.recipientId === message.senderId)
						message.deleted = true
				}
			}
			this.messages = messages;
		},
		addMessageCurrent(messages: IMessage[], channelId: number){
			for (let message of messages) {
				for (const obj of this.blockList) {
					if (obj.recipientId === message.senderId)
						message.deleted = true
				}
			}
			for (let obj of this.rooms){
				if (obj["roomId"] === messages[0].channelId){
					if (obj.messages)
						obj.messages = obj.messages.concat(messages);
					else
						obj.messages = messages;
					if (channelId === messages[0].channelId)
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
							else if (param === "admin")
								user.isAdmin = true;
							break ;
						}
					}
				}
			}
			if (param === "block"){
				this.blockList = [
					...this.blockList,
					{
						applicantId: useCurrentUserStore().userId,
						recipientId: userId,
						createdAt: content
					}
				]
				for (let message of this.messages) {
					if (userId === message.senderId)
						message.deleted = true
				}
			}
			else if (param === "unblock"){
				let tmp = this.blockList
				this.blockList = []
				for (let obj of tmp) {
					if (obj.recipientId !== userId)
						this.blockList = [
							...this.blockList,
							obj
						]
				}
				for (let message of this.messages) {
					if (userId === message.senderId)
						message.deleted = false
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
		},
		listBlock(listBlock: IBlocked[]) {
			this.blockList = listBlock;
		}
	}
})