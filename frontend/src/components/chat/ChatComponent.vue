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
		<template #room-options="{}" v-if='currentUser.isAdmin === false '>
			<p></p>
		</template>
		</chat-window>
		<chat-admin-modal/>
		<chat-new-room-modal/>
		<chat-info-user-modal :modalUserId="modalUserId" :modalUserName="modalUserName" :modalAvatar="modalAvatar" :menuMessageModal="menuMessageModal"/>
	</div>
</template>

<script lang='ts'>
import ChatWindow, {Message} from 'vue-advanced-chat';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';
import { IChannel, IMessage, IUserChannel } from 'shared/models/socket-events';
import ChatSearch from "./ChatSearch.vue";
import ChatNewRoomModal from "./ChatNewRoomModal.vue";
import ChatAdminModal from "./ChatAdminModal.vue";
import ChatInfoUserModal from "./ChatInfoUserModal.vue";
import ChatService from "../../services/ChatService";
import { computed, defineComponent } from '@vue/runtime-core';
import { useChatRoomsStore } from '@/store/modules/chatroom/chatroom'
import { useAuthStore } from "@/store/auth";
import { toNumber } from '@vue/shared';
import { Modal } from "bootstrap";
import UserService from '@/services/UserService';

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
		return { 	AuthStore,
					chatRoomsStore,
					storeRoom: computed(() => chatRoomsStore.getRooms),
		};
	},
	name: 'Chat',
	props: {
		size: String,
	},
	components: {
		ChatWindow,
		ChatSearch,
		ChatNewRoomModal,
		ChatInfoUserModal,
		ChatAdminModal
	},
	created() {
		this.currentUserId = toNumber(localStorage.getItem('userId'))
	},
	unmounted() {
		this.menuMessageModal.hide();
		this.adminModal.hide();
	},
	data(){
		return {
			currentUserId: -1 as number,
			currentUser: {} as IUserChannel ,
			currentRoom: null as IChannel | null,
			opened: true as boolean, 
			messages: [] as IMessage[],
			messagesLoaded: false as boolean,
			loadingRooms: false as boolean,
			roomActions: [
				{ name: 'leaveChannel', title: 'Leave Channel' },
			],
			menuActions: [
				{ name: 'adminModal', title: 'Admin Channel' },
			],
			messageactions: [
				{
					name: 'More informations',
					title: 'More informations'
				},
			],
			menuMessageModal: {} as Modal,
			adminModal: {} as Modal,
			modalUserId: -1 as number,
			modalUserName: "" as string,
			modalAvatar: "" as string
		}
	},
	mounted() {
		this.menuMessageModal = new Modal("#menuMessageModal");
		this.adminModal = new Modal("#adminModal");
	},
	watch: {
		async storeRoom(newId, oldId) {
			//console.log("watcher")
			if (newId && newId !== 0 && this.currentRoom) {
				for (const obj of this.storeRoom){
					if (obj["roomId"].valueOf() === this.currentRoom.roomId) { 
						if (obj["messages"] && obj["messages"] != this.currentRoom.messages){
							this.currentRoom.messages = obj["messages"];
							return ;
						}
						return ;
					}
				}
			}
		}
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
			room["users"].forEach(element =>{
				if (element["_id"] === this.currentUserId){
					this.currentUser = element
					return;
				}}
			);
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
		sendMessage({content, roomId}: {content: Message, roomId: number}) {
			let send = content;
			ChatService.createMessage(roomId, {message: send}).catch(error => {
				console.log("err", error.response)
			});
			// let newMessage = {
			// 		_id: this.messages.length,
			// 		content: message.content,
			// 		senderId: this.currentUserId,
			// 		username: this.userName,
			// 		avatar: this.avatar,
			// 		timestamp: new Date().toString().substring(16, 21),
			// 		date: new Date().toDateString()
			// };
			// let newMessage: IMessage;
			// let y = new Date().toString().substring(16, 21)
			// newMessage = {
			// 		_id: this.messages.length,
			// 		username: localStorage.getItem('username'),
			// 		content: message.content,
			// 		createdAt: new Date().toString().substring(16, 21),
			// 		date: new Date().toDateString(),
			// 		channel: room,
			// 		senderId: this.currentUserId
			// };
			// this.messages = [
			// 	...this.messages,
			// 	newMessage
			// ]
		},
		menuActionHandler({ action = {} as CustomAction, roomId = {} as number }) {
			switch (action.name) {
				case 'leaveChannel':
					return this.leaveChannel(roomId)
				case 'adminModal':
					return this.adminModal.show();
			}
		},
		leaveChannel(roomId: number ){
			for (const obj of this.storeRoom){
				if (obj["roomId"].valueOf() === roomId) { 
					if (obj["isDm"].valueOf() === true){
						alert("You can't leave a Direct Message Channel")
						return ;
					}
					break ;
				}
			}
			ChatService.leaveChannel(roomId);
		},
		menuMessageHandler({ action = {} as CustomAction, roomId = {} as number, message = {} as IMessage }) {
			switch (action.name) {
				case 'More informations':{
					if (this.$route.path === "/chat"){
						this.modalUserId = message.senderId;
						if (message.username)
							this.modalUserName = message.username
						UserService.getAvatarOfUser(message.senderId).then((av) => (this.modalAvatar = av));
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