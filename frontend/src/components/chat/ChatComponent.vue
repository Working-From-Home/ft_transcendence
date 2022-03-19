<template>
	<div class="chat">
		<chat-window as AdvancedChat
			:height="screenHeight"
			:current-user-id="currentUserId"
			:rooms="(storeRoom as any)"
			:rooms-order="'desc'"
			:rooms-loaded="true"
			:theme="'dark'"
			:text-Messages="textMessages"
			:messages="(storeMessage as any)"
			:messages-loaded="messagesLoaded"
			:showReactionEmojis="false"
			:showAudio="false"
			:showFiles="false"
			:show-footer="!chatRoomsStore.isMute"
			:show-new-messages-divider="false"
			:room-actions="roomActions"
			:menu-actions="menuActions"
			:message-actions="messageactions"
			:rooms-list-opened="opened" 
			:responsive-breakpoint="300" 
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
		<template #room-options="{}" v-if='currentUser.isAdmin === false || !isChatView '>
			<p></p>
		</template>
		</chat-window>
		<chat-admin-modal :roomId="currentRoom.roomId" :currentUserId="currentUserId"/>
		<chat-new-room-modal/>
		<chat-info-user-modal :isCurrent="isCurrent" :UserInfo="UserInfo" :modalUserId="modalUserId" :modalUserName="modalUserName" :modalAvatar="modalAvatar" :menuMessageModal="menuMessageModal"/>
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
import { useChatRoomsStore } from '@/store/chatroom'
import { useAuthStore } from "@/store/auth";
import { toNumber } from '@vue/shared';
import { Modal } from "bootstrap";
import UserService from '@/services/UserService';
import moment from 'moment'
import { useNotificationsStore } from '@/store/notifications';

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
		const notificationsStore = useNotificationsStore();
		return { 	AuthStore,
					chatRoomsStore,
					notificationsStore,
					storeRoom: computed(() => chatRoomsStore.getRooms),
					storeMessage: computed(() => chatRoomsStore.getMessages),
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
		this.$socketapp.on("sendMessage", async (resp: IMessage[]) => {
			this.chatRoomsStore.addMessageCurrent(resp, this.currentRoom.roomId);
		});
		this.$socketapp.on("changeParam", async (param: string, channelId: number, userId: number, content: Date | null) => {
			this.chatRoomsStore.addParam(param, channelId, userId, content);
		});
	},
	unmounted() {
		this.menuMessageModal.hide();
		this.adminModal.hide();
	},
	data(){
		return {
			currentUserId: -1 as number,
			currentUser: {} as IUserChannel ,
			currentRoom: {roomId: -1} as IChannel,
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
			modalAvatar: "" as string,
			UserInfo: {},
			isMute: false,
			isCurrent: false as boolean,
			textMessages: {
				MESSAGE_DELETED: 'This message is blocked',
			}
		}
	},
	mounted() {
		this.menuMessageModal = new Modal("#menuMessageModal");
		this.adminModal = new Modal("#adminModal");
	},
	computed: {
		isChatView() {
			if (this.$route.path === "/chat")
				return true;
			return false;
		},
		screenHeight() {
			return window.innerHeight - 190 + 'px' 
		}
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
			this.isMuted();
			if (this.size === "mini")
				this.opened = false;
			if (options.reset)
				this.messages = [];
			this.messagesLoaded = false;
			setTimeout(() => {
				if (room.messages && room.messages.length > 0)
					this.chatRoomsStore.fetchMessage(room.messages);
				else 
					this.chatRoomsStore.fetchMessage([]);
				this.messagesLoaded = true
			})
		},
		async sendMessage({content, roomId}: {content: Message, roomId: number}) {
			let send = content;
			await ChatService.createMessage(roomId, {message: send}).catch(({ response }) => {
				this.notificationsStore.enqueue("warning", "Error", response.data.message)
			});
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
						this.notificationsStore.enqueue("warning", "Error", "You can't leave a Direct Message Channel")
						return ;
					}
					break ;
				}
			}
			ChatService.leaveChannel(roomId);
		},
		async isMuted() {
			if (this.currentUser["mutedUntil"] === null)
				this.chatRoomsStore.isMute = false;
			else {
				let curentDate = moment.utc(this.currentUser.mutedUntil)
				if (moment(curentDate).isBefore()) {
					this.chatRoomsStore.isMute = false;
					ChatService.muteUser(this.currentRoom.roomId, this.currentUserId, null).catch(({ response }) => {
						this.notificationsStore.enqueue("warning", "Error", response.data.message)
					});
				} 
				else {
					this.chatRoomsStore.isMute = true;
					setTimeout(() => {
						this.chatRoomsStore.isMute = false;
						ChatService.muteUser(this.currentRoom.roomId, this.currentUserId, null).catch(({ response }) => {
						this.notificationsStore.enqueue("warning", "Error", response.data.message)
					});
					}, curentDate.diff(moment()));
				}
			}
		},
		menuMessageHandler({ action = {} as CustomAction, roomId = {} as number, message = {} as IMessage }) {
			switch (action.name) {
				case 'More informations':{
					if (this.$route.path === "/chat"){
						this.modalUserId = message.senderId;
						if (message.username)
							this.modalUserName = message.username
						this.isCurrent = this.modalUserId === this.currentUserId,
						UserService.getAvatarOfUser(message.senderId).then((av) => (this.modalAvatar = av));
						ChatService.searchUsersByTitle(this.modalUserName, this.currentRoom.roomId).then((resp: any) => {
							for (const obj of resp) {
								if (obj._id === this.modalUserId){
									this.UserInfo = JSON.parse(JSON.stringify(obj));
								}
							}
						});
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
	margin: 1rem auto;
}
body-webkit-scrollbar-thumb {
  background-color: blue; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid orange; /* creates padding around scroll thumb */
}
</style>