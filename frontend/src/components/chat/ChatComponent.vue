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
			@send-message="sendMessage"
			@fetch-messages="fetchMessages"
			@add-room="addRoom"
		/>
	</div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'

export default {
	name: 'Chat',
	components: {
		ChatWindow
	},
	data() {
		return {
			currentUserId: 1234,
			rooms: [
				{
					roomId: 1,
					roomName: 'Room 1',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					messages: [],
					users: [
						{ _id: 1234, username: 'John Doe' },
						{ _id: 4321, username: 'John Snow' }
					]
				}
			],
			messages: [],
			messagesLoaded: false
		}
	},
	methods: {
		fetchMessages({ room = {}, options = {} }) {
			console.log('test', room);
			setTimeout(() => {
				if (options.reset) {
					this.messages = this.addMessages()
				} else {
					this.messagesLoaded = true
				}
			})
		},
		addMessages() {
			const messages = []
			messages.push({
					_id: 1,
					content: `Salut`,
					senderId: 4321,
					username: 'John Doe',
					date: '8 December',
					timestamp: '10:20'
				})
			return messages
		},
		sendMessage(message) {
			this.messages = [
				...this.messages,
				{
					_id: this.messages.length,
					content: message.content,
					senderId: this.currentUserId,
					timestamp: new Date().toString().substring(16, 21),
					date: new Date().toDateString()
				}
			]
		},
		addRoom(){
			this.rooms = [
				...this.rooms,
				{
					roomId: this.rooms.length + 1,
					roomName: 'Room ' + (this.rooms.length + 1),
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					users: [
						{ _id: 1234, username: 'John Doe' },
						{ _id: 4321, username: 'John Snow' }
					]
				}
			]
		}
	}
}
</script>

<style>
body {
	font-family: 'Quicksand', sans-serif;
}
.chat {
	max-width: 90%;
	margin: 1rem auto;
}
</style>