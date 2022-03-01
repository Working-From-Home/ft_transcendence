<template>
	<div class="chat">
		<chat-window as any
			height="calc(100vh - 130px)"
			:current-user-id="currentUserId"
			:rooms="(storeRoom as any)"
			:rooms-order="'desc'"
			:rooms-loaded="true"
			:messages="(messages as any)"
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
		<chat-info-user-modal :modalMessageUserId="modalMessageUserId" :menuMessageModal="menuMessageModal"/>
	</div>
</template>

<script lang='ts'>
import ChatWindow from 'vue-advanced-chat';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';
import { IChannel, IMessage, IUserChannel } from 'shared/models/socket-events';
import ChatSearchTmp from "./ChatSearchTmp.vue";
import ChatNewRoomModal from "./ChatNewRoomModal.vue";
import ChatInfoUserModal from "./ChatInfoUserModal.vue";
import ChatService from "../../services/ChatService";
import { computed, defineComponent } from '@vue/runtime-core';
import { useChatRoomsStore } from '@/store/modules/chatroom/chatroom'
import { useAuthStore } from "@/store/modules/auth/auth";
import { toNumber } from '@vue/shared';
import { Modal } from "bootstrap";

interface CustomAction {
	name: string
	title: string
};
interface CustomOptions {
	reset: boolean
}

export default defineComponent({
	setup() {
		const chatRoomsStore = useChatRoomsStore();
		const AuthStore = useAuthStore();
		return { AuthStore, chatRoomsStore, storeRoom: computed(() => chatRoomsStore.getRooms) };
	},
	name: 'Chat',
	props: {
		size: String,
	},
	components: {
		ChatWindow,
		ChatSearchTmp,
		ChatNewRoomModal,
		ChatInfoUserModal
	},
	created() {
		this.currentUserId = toNumber(localStorage.getItem('userId'))
	},
	data(){
		return {
			currentUserId: -1 as number,
			currentUser: null as IUserChannel | null,
			currentRoom: null as IChannel | null,
			rooms: [] as IChannel[] | [],
			opened: true as boolean, 
			messages: [] as IMessage[],
			messagesLoaded: false as boolean,
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
			menuMessageModal: {} as Modal,
			modalMessageUserId: -1 as number
		}
	},
	mounted() {
		this.menuMessageModal = new Modal("#menuMessageModal");
	},
	computed: {
		isChatView() {
			if (this.$route.path === "/chat")
				return true;
			return false;
		},
		isMuted() {
			while (this.currentUser === null)
				;
			if (this.currentUser["mutedUntil"] === null)
				return false;
			return true;
		},
	},
	methods: {
		goChannel() {
			this.$router.push('/chat');
		},
		fetchMessages({ room = {} as IChannel, options = {} as CustomOptions}) {
			this.currentRoom = room;
			for (const obj of room["users"]){
				if (obj["_id"] === this.currentUserId){
					this.currentUser = obj
					break;
				}
			}
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
					username: localStorage.getItem('username'),
					content: message.content,
					createdAt: new Date().toString().substring(16, 21),
					date: new Date().toDateString(),
					channel: room,
					senderId: this.currentUserId
			};
			this.messages = [
				...this.messages,
				newMessage
			]
			this.chatRoomsStore.addMessage(newMessage, message.roomId);
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
		menuMessageHandler({ action = {} as CustomAction, roomId = {} as number, message = {} as IMessage }) {
			switch (action.name) {
				case 'More informations':{
					if (this.$route.path === "/chat"){
						this.modalMessageUserId = message["senderId"]
						return this.menuMessageModal.show();
					}
					this.$router.push('/chat');
				}
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