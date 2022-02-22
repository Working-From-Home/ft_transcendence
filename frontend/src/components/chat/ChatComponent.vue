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
			:message-actions="messageactions"
			:rooms-list-opened="opened"
			@send-message="sendMessage"
			@fetch-messages="fetchMessages"
			@add-room="addRoom"
			@room-action-handler="menuActionHandler"
			@menu-action-handler="menuActionHandler"
			@message-action-handler="menuMessageHandler"
		>
		<template #rooms-list-search="{}">
			<button v-if="isChatView" type="button" id="btn-front" class="btn-front btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
				Add a New Channel
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
					<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
					<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
				</svg>
			</button>
			<button v-else type="button" id="btn-front" class="btn-front btn btn-outline-info" data-bs-target="#staticBackdrop" @click="goChannel">
				Open Channel
			</button>
		</template>
		</chat-window>
		<chat-new-room-modal/>
	</div>
</template>

<script lang='ts'>
import ChatWindow from 'vue-advanced-chat';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';
import { IChannel, IMessage } from 'shared/models/socket-events';
import ChatSearchTmp from "./ChatSearchTmp.vue";
import ChatNewRoomModal from "./ChatNewRoomModal.vue";
import ChatService from "../../services/ChatService";
import { computed, defineComponent } from '@vue/runtime-core';

interface State {
  currentUserId: number,
  rooms: IChannel[],
  opened: boolean,
  messages: IMessage[],
  messagesLoaded: boolean,
  loadingRooms: boolean,
  roomActions: [{ name: 'leaveChannel', title: 'Leave Channel' }, { name: 'destroyChannel', title: 'Destroy Channel' }],
  menuActions: [
				{ name: 'muteUser', title: 'Mute User' },
				{ name: 'kickUser', title: 'Kick User' },
				{ name: 'banUser', title: 'Ban User' },
  ],
  messageactions: [
					{
						name: 'More informations',
						title: 'More informations'
					},
  ]
};
interface CustomAction {
	name: string
	title: string
};
interface CustomOptions {
	reset: boolean
}

export default defineComponent({
	name: 'Chat',
	props: {
		size: String,
	},
	components: {
		ChatWindow,
		ChatSearchTmp,
		ChatNewRoomModal
	},
	created() {
		this.currentUserId = this.$store.getters.myUserId,
		this.fetchRooms(),
		this.messages = [];
	},
	data: (): State => {
		return {
			currentUserId: -1,
			rooms: [],
			opened: true, 
			messages: [],
			messagesLoaded: false,
			loadingRooms: false as boolean,
			roomActions: [
				{ name: 'leaveChannel', title: 'Leave Channel' },
				{ name: 'destroyChannel', title: 'Destroy Channel' },
			],
			menuActions: [
				{ name: 'muteUser', title: 'Mute User' },
				{ name: 'kickUser', title: 'Kick User' },
				{ name: 'banUser', title: 'Ban User' },
			],
			messageactions: [
				{
					name: 'More informations',
					title: 'More informations'
				},
			],
		}
	},
	computed: {
		watchRooms() {
			return this.$store.getters.getRooms
		},
		isChatView() {
			if (this.$route.path === "/chat")
				return true;
			return false;
		}
	},
	watch:{
		watchRooms(value) {
			this.fetchRooms();
		},
	},
	methods: {
		goChannel() {
			this.$router.push('/chat');
		},
		fetchMessages({ room = {} as IChannel, options = {} as CustomOptions}) {
			if (this.size === "mini")
				this.opened = false;
			if (options.reset)
				this.messages = [];
			this.messagesLoaded = false;
			setTimeout(() => {
				if (room.messages && room.messages.length > 0)
					this.messages = room.messages;
				else 
					this.messages = [];
				this.messagesLoaded = true
			})
		},
		sendMessage(room = {} as IChannel, message: any) {
			// let newMessage = {
			// 		_id: this.messages.length,
			// 		content: message.content,
			// 		senderId: this.currentUserId,
			// 		username: this.userName,
			// 		avatar: this.avatar,
			// 		timestamp: new Date().toString().substring(16, 21),
			// 		date: new Date().toDateString()
			// };
			let newMessage: IMessage;
			let y = new Date().toString().substring(16, 21)
			newMessage = {
					_id: this.messages.length,
					username: this.$store.getters.myUserName,
					content: message.content,
					createdAt: new Date().toString().substring(16, 21),
					date: new Date().toDateString(),
					channel: room,
					senderId: this.$store.getters.myUserId
			};
			this.messages = [
				...this.messages,
				newMessage
			]
			this.$store.dispatch('addMessage', {roomId: message.roomId, newMessage: newMessage});
		},
		async fetchRooms(){
			this.rooms = JSON.parse(JSON.stringify(this.$store.getters.getRooms));
			//console.log("rooms", this.rooms);
		},
		addRoom(){
			let newRoom: IChannel;
			newRoom = {
				roomId: this.rooms.length + 1 as number,
				roomName: 'Room ' + (this.rooms.length + 1),
				avatar: "",
				isDm: false,
				messages: [],
				createdAt: new Date(),
				owner: { 
						_id: this.$store.getters.myUserId, 
						username: this.$store.getters.myUserName,
						channelId: this.rooms.length + 1,
						isOwner: true,
						isAdmin: "admin",
						mutedUntil: null
				},
				users: [
					{ 
						_id: this.$store.getters.myUserId, 
						username: this.$store.getters.myUserName,
						channelId: this.rooms.length + 1,
						isOwner: true,
						isAdmin: "admin",
						mutedUntil: null
					},
					{ 	
						_id: 4321,
						username: 'John Snow',
						channelId: this.rooms.length + 1,
						isOwner: false,
						isAdmin: "user",
						mutedUntil: null
					}
				]
			};
			this.rooms = [
				...this.rooms,
				newRoom
			]
		},
		menuActionHandler({ action = {} as CustomAction, roomId = {} as number }) {
			switch (action.name) {
				case 'leaveChannel':
					return this.leaveChannel(roomId)
				case 'destroyChannel':
					return this.destroyChannel()
			}
		},
		leaveChannel(roomId: number ){
			console.log("id", roomId)
			ChatService.leaveChannel(roomId);
		},
		destroyChannel() {
			//
		},
		menuMessageHandler({ action = {} as CustomAction, roomId = {} as number }) {
			switch (action.name) {
				case 'More informations':
					return $('#my-modal').modal('show');;
			}
		},
	}
})
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