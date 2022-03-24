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
			:username-options="{minUsers: 2, currentUser: false}"
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
			<button v-if="isChatView" type="button" id="btn-front" class="btn-front btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
				<font-awesome-icon icon="plus" class="pe-2" />
				<span>Create channel</span>
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
import ChatWindow, {Message, Room, CustomAction } from 'vue-advanced-chat'
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
import { useCurrentUserStore } from '@/store/currentUser';
import { Modal } from "bootstrap";
import UserService from '@/services/UserService';
import moment from 'moment'
import { useNotificationsStore } from '@/store/notifications';
import socket from '@/socketApp';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus);

interface CustomOptions {
	reset: boolean
}

export default defineComponent({
	setup() {
		const chatRoomsStore = useChatRoomsStore();
		const AuthStore = useAuthStore();
		const notificationsStore = useNotificationsStore();
		const currentUserStore = useCurrentUserStore();
		return { 	AuthStore,
					chatRoomsStore,
					notificationsStore,
					currentUserStore,
					storeRoom: computed(() => chatRoomsStore.getRooms),
					storeMessage: computed(() => chatRoomsStore.getMessages),
		};
	},
	name: 'Chat',
	components: {
		ChatWindow,
		ChatSearch,
		ChatNewRoomModal,
		ChatInfoUserModal,
		ChatAdminModal,
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
			UserInfo: {} as IUserChannel,
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
	created() {
		this.currentUserId = this.currentUserStore.userId;
		socket.off('sendMessage');
		this.$socketapp.on("sendMessage", async (resp: IMessage[]) => {
			this.chatRoomsStore.addMessageCurrent(resp, this.currentRoom.roomId);
		});
	},
	unmounted() {
		this.menuMessageModal.hide();
		this.adminModal.hide();
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
					this.modalUserId = message.senderId;
					if (message.username)
						this.modalUserName = message.username
					this.isCurrent = this.modalUserId === this.currentUserId,
					UserService.getAvatarOfUser(message.senderId).then((av) => (this.modalAvatar = av));
					ChatService.searchUsersByTitle(this.modalUserName, this.currentRoom.roomId).then((resp: IUserChannel[]) => {
						for (const obj of resp) {
							if (obj._id === this.modalUserId){
								this.UserInfo = JSON.parse(JSON.stringify(obj));
							}
						}
					});
					return this.menuMessageModal.show();
				}
			}
		},
		
	}
})
</script>

<style>
.chat {
	margin: 1rem auto;
}

.vac-message-wrapper .vac-message-container {
    min-width: 130px;
}

.vac-message-wrapper .vac-message-card {
	background: rgba(116, 164, 188, 0.15)!important;
}
.vac-message-wrapper .vac-message-current {
    background: rgb(65, 196, 136, 0.8 )!important;
}

.vac-message-wrapper .vac-text-username {
    font-weight: bold;
    color: #42B983;
	text-align: left;
}

.vac-room-header .vac-room-name {
    color: #42B983;
	font-weight: 700;
}
.vac-col-messages .vac-box-footer {
    border-radius: 0px 0px 0px 4px;
}
body-webkit-scrollbar-thumb {
  background-color: blue; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
  border: 3px solid orange; /* creates padding around scroll thumb */
}
</style>