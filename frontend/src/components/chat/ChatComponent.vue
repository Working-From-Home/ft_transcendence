<template>
	<div class="chat">
		<chat-window
			height="calc(100vh - 130px)"
			:current-user-id="currentUserId"
			:rooms="rooms"
			:rooms-loaded="true"
			:messages="messages"
			:messages-loaded="messagesLoaded"
			:showReactionEmojis="false"
			:showAudio="false"
			:showFiles="false"
			:room-actions="roomActions"
			:menu-actions="menuActions"
			:rooms-list-opened="opened"
			@send-message="sendMessage"
			@fetch-messages="fetchMessages"
			@add-room="addRoom"
			@room-action-handler="menuActionHandler"
			@menu-action-handler="menuActionHandler"
		>
		</chat-window>
	</div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'


export default {
	name: 'Chat',
	props: {
		size: String,
	},
	components: {
		ChatWindow
	},
	created() {
		this.$store.dispatch('tmpRooms', {id: this.$store.getters.myUserId});
		this.rooms = this.$store.getters.getRooms;
		this.messages = this.rooms.messages;
	},
	data() {
		return {
			currentUserId: this.$store.getters.myUserId,
			userName: this.$store.getters.myUserName,
			email: this.$store.getters.myEmail,
			avatar: this.$store.getters.myAvatar,
			rooms: [],
			opened: true, 
			messages: [],
			messagesLoaded: false,
			roomActions: [
				{ name: 'leaveChannel', title: 'Leave Channel' },
				{ name: 'destroyChannel', title: 'Destroy Channel' },
			],
			menuActions: [
				{ name: 'muteUser', title: 'Mute User' },
				{ name: 'kickUser', title: 'Kick User' },
				{ name: 'banUser', title: 'Ban User' },
			],
		}
	},
	methods: {
		fetchMessages({ room = {}, options = {} }) {
			console.log('this.size', this.size)
			if (this.size === "mini")
				this.opened = false;
			if (options.reset)
				this.messages = [];
			this.messagesLoaded = false;
			setTimeout(() => {
				if (room.messages.length > 0)
					this.messages = room.messages;
				else 
					this.messages = [];
				this.messagesLoaded = true
			})
		},
		sendMessage(message) {
			let newMessage = {
					_id: this.messages.length,
					content: message.content,
					senderId: this.currentUserId,
					username: this.userName,
					avatar: this.avatar,
					timestamp: new Date().toString().substring(16, 21),
					date: new Date().toDateString()
			};
			this.messages = [
				...this.messages,
				newMessage
			]
			this.$store.dispatch('addMessage', {roomId: message.roomId, newMessage: newMessage});
		},
		addRoom(){
			this.rooms = [
				...this.rooms,
				{
					roomId: this.rooms.length + 1,
					roomName: 'Room ' + (this.rooms.length + 1),
					messages: [],
					users: [
						{ _id: this.currentUserId, username: this.userName },
						{ _id: 4321, username: 'John Snow' }
					]
				}
			]
		},
		menuActionHandler({ action, roomId }) {
			switch (action.name) {
				case 'leaveChannel':
					return this.leaveChannel(roomId)
				case 'destroyChannel':
					return this.destroyChannel(roomId)
				case 'deleteRoom':
					return this.deleteRoom(roomId)
			}
		},
		leaveChannel(roomId){
			let rooms = [];
			//this.rooms = this.$store.dispatch('leaveChannel', {roomId: roomId, UserId: this.currentUserId});
			this.loadingRooms = true
			for (var i = 0; i < this.rooms.length; i++){
				if (this.rooms[i].roomId !== roomId){
					rooms = [
						...rooms,
						this.rooms[i]
					];
				}
			}
			this.$store.dispatch('fetchRooms', {id: this.$store.getters.myUserId, rooms: rooms});
			this.rooms = this.$store.getters.getRooms
			this.loadingRooms = false
		},
		destroyChannel(roomId) {
			console.log('1', this.rooms);
			this.rooms = [];
		}
	}
}
</script>

<style>
body {
	font-family: 'Quicksand', sans-serif;
}
.chat {
	max-width: 100%;
	margin: 1rem auto;
}
</style>