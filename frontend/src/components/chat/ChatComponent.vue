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
		<template #rooms-list-search="">
			<chat-new-room-modal/>
		</template>
		</chat-window>
	</div>
</template>

<script lang='ts'>
import { Options, Vue } from "vue-class-component";
import ChatWindow from 'vue-advanced-chat';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';
import { IChannel, Message } from 'shared/models/socket-events';
import ChatSearchTmp from "./ChatSearchTmp.vue";
import ChatNewRoomModal from "./ChatNewRoomModal.vue";
import ChatService from "../../services/ChatService";

interface State {
  currentUserId: string,
  userName: string,
  email: string,
  avatar: string,
  rooms: IChannel[],
  opened: boolean,
  messages: [],
  messagesLoaded: boolean,
  loadingRooms: boolean,
  roomActions: [{ name: 'leaveChannel', title: 'Leave Channel' }, { name: 'destroyChannel', title: 'Destroy Channel' }],
  menuActions: [
				{ name: 'muteUser', title: 'Mute User' },
				{ name: 'kickUser', title: 'Kick User' },
				{ name: 'banUser', title: 'Ban User' },
  ],
};
interface CustomAction {
	name: string
	title: string
};
interface CustomOptions {
	reset: boolean
}

@Options({
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
		this.userName = this.$store.getters.myUserName,
		this.email = this.$store.getters.myEmail,
		this.avatar = this.$store.getters.myAvatar,
		this.fetchRooms(),
		this.messages = this.rooms.messages;
	},
	data: (): State => {
		return {
			currentUserId: '',
			userName: '',
			email: '',
			avatar: '',
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
		}
	},
	computed: {
		watchRooms() {
			return this.$store.getters.getRooms
		}
	},
	watch:{
		watchRooms(value) {
			this.fetchRooms();
		},
	},
	methods: {
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
		sendMessage(message: any) {
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
		async fetchRooms(){
			this.rooms = JSON.parse(JSON.stringify(this.$store.getters.getRooms));
			//console.log("rooms", this.rooms);
		},
		addRoom(){
			
			this.rooms = [
				...this.rooms,
				{
					roomId: this.rooms.length + 1 as number,
					roomName: 'Room ' + (this.rooms.length + 1),
					messages: [],
					users: [
						{ _id: this.currentUserId, username: this.userName },
						{ _id: 4321, username: 'John Snow' }
					]
				}
			]
		},
		menuActionHandler({ action = {} as CustomAction, roomId = {} as number }) {
			switch (action.name) {
				case 'leaveChannel':
					return this.leaveChannel(roomId)
				case 'destroyChannel':
					return this.destroyChannel()
				case 'deleteRoom':
					return this.deleteRoom()
			}
		},
		leaveChannel(roomId: number ){
			console.log("id", roomId)
			ChatService.leaveChannel(roomId);
		},
		destroyChannel() {
			//
		}
	}
})
export default class Chat extends Vue {

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