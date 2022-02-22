import { defineStore } from "pinia";

export interface State {
	onlineUsers : number[];
	inGameUsers : number[];
}

export const useStatusStore = defineStore('status', {
	state : (): State => ({
		onlineUsers : [],
		inGameUsers : []
	}),
	getters: {
		getonlineUsers() : number[] {
			return this.onlineUsers;
		},
		getinGameusers() : number[] {
			return this.inGameUsers;
		},
		isOnline : (state) => {
			return(id : number) => state.onlineUsers.includes(id)
		},
		isInGame : (state) => {
			return(id : number) => state.inGameUsers.includes(id)
		},
	},
	actions : {
		setOnlineUsers(userIds : number[]) {
			console.log(`store: userids: ${userIds}`);
			this.onlineUsers = userIds;
		},
		addOnlineUser(userId : number) {
			this.onlineUsers.push(userId);
		},
		removeOnlineUser(userId : number) {
			this.onlineUsers = this.onlineUsers.filter(id => id !== userId);
		},
		setInGameUsers(userIds : number[]) {
			this.inGameUsers = userIds;
		}
	}
})