<template>
	<div>
		<div class="modal fade text-black" id="adminModal"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Channel settings</h5>
						<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>

					<div class="modal-body">

						<form ref="adminForm" @submit.prevent="">
							<div class="input-group form-floating mb-4">
								<input
								v-model="userName"
								@input="searchUsers()"
								type="search"
								class="form-control"
								id="userName"
								placeholder=""
								list="list-id"
								required
								/>
								<datalist id="list-id">
									<option v-for="result in results" :key="result._id" >
											{{ result.username }}
									</option>
								</datalist>
								<label for="userName">search a user</label>
								<button type="submit" class="btn btn-outline-success" style="min-width:4.5rem;" @click="Admin">admin</button>
								<button type="submit" class="btn btn-outline-warning" style="min-width:4.5rem;" @click="muted">mute</button>
								<button type="submit" class="btn btn-outline-danger" style="min-width:4.5rem;" @click="banned">ban</button>
							</div>
						</form>
						<hr>
						<form @submit.prevent="">
							<div class="modal-body">
								<div class="input-group form-floating mb-4">
									<input
									v-model="newPassword"
									type="text"
									class="form-control"
									id="newPassword"
									placeholder=""
									/>
									<label for="newPassword">enter new password</label>
									<button type="submit" class="btn btn-success" data-bs-dismiss="modal" @click="changePassword">change password</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade text-black" id="timeModal" aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Time</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
				<form @submit.prevent="">
					<div class="modal-body">
						<div class="d-flex justify-content-center" v-if="isMute">
							<p class="align-self-end" >This user is already mute</p>
						</div>
						<button v-if="isMute" type="submit" class="btn btn-outline-warning ms-2" @click="unmuted">Unmute</button>
						<div class="d-flex justify-content-center" v-if="isBan">
							<p>This user is already ban</p>
						</div>
						<button v-if="isBan" type="submit" class="btn btn-outline-warning" @click="unbanned">Unban</button>
						<div v-if="!isMute && !isBan" class="input-group mb-4">
							<input type="datetime-local" v-model="time" class="form-control" id="exampleFormControlInput1">
							<button type="submit" class="btn btn-outline-danger" @click="submitTime">Time</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatService from "../../services/ChatService";
import { Modal } from "bootstrap";
import { useNotificationsStore } from '@/store/notifications';
import { IUserChannel } from 'shared/models/socket-events';

export default defineComponent({
  setup() {
	const notificationsStore = useNotificationsStore();
	return { notificationsStore };
  },
	props: {
		currentUserId: {type: Number, required: true},
		roomId: {type: Number, required: true},
	},
	data() {
		return {
			userName: '' as string,
			newPassword: '' as string,
			results: [] as IUserChannel[],
			userTarget: {} as any,
			timeModal: {} as Modal,
			action: null as ("ban" | "mute" | "admin" | null),
			time: new Date() as Date,
			isMute: false as boolean,
			isBan: false as boolean,
		}
	},
	mounted() {
		this.timeModal = new Modal("#timeModal");
	},
	methods: {
		searchUsers() {
			this.results = [];
			this.userTarget = {};
			this.action = null;
			ChatService.searchUsersByTitle(this.userName, this.roomId).then((resp: IUserChannel[]) => {
				for (const obj of resp) {
					if (obj._id != this.currentUserId)
					  this.results = this.results.concat(obj);
				}
			});
		},
		muted() {
			if (!this.userName) {
				this.notificationsStore.enqueue("warning", "Error", "Username can't be empty")
				return ;
			}
			let results = JSON.parse(JSON.stringify(this.results))
			for (const obj of results) {
				if (obj.username === this.userName) {
					this.userTarget = obj;
					this.action = "mute";
					this.isMute = obj.mutedUntil != null;
					this.timeModal.show();
					return ;
				}
			}
			this.notificationsStore.enqueue("warning", "Error", this.userName + " isn't a user of this room")
		},
		banned() {
			if (!this.userName) {
				this.notificationsStore.enqueue("warning", "Error", "Username can't be empty")
				return ;
			}
			let results = JSON.parse(JSON.stringify(this.results))
			for (const obj of results) {
				if (obj.username === this.userName) {
					this.userTarget = obj;
					this.action = "ban";
					this.isBan = obj.bannedUntil != null;
					this.timeModal.show();
					return ;
				}
			}
			this.notificationsStore.enqueue("warning", "Error", this.userName + " isn't a user of this room")
		},
		unmuted() {
			ChatService.muteUser(this.roomId, this.userTarget._id, null)
			this.isMute = false;
			this.userName = '';
			this.timeModal.hide();
		},
		unbanned() {
			ChatService.banUser(this.roomId, this.userTarget._id, null)
			this.isBan = false;
			this.userName = '';
			this.timeModal.hide();
		},
		submitTime() {
			if (this.action === "mute")
				ChatService.muteUser(this.roomId, this.userTarget._id, this.time).catch(({ response }) => {
					this.notificationsStore.enqueue("warning", "Error", response.data.message)
			});
			if (this.action === "ban")
				ChatService.banUser(this.roomId, this.userTarget._id, this.time).catch(({ response }) => {
					this.notificationsStore.enqueue("warning", "Error", response.data.message)
			});
			this.userName = '';
			this.timeModal.hide();
		},
		Admin() {
			if (!this.userName) {
				this.notificationsStore.enqueue("warning", "Error", "Username can't be empty")
				return ;
			}
			let results = JSON.parse(JSON.stringify(this.results))
			for (const obj of results) {
				if (obj.username === this.userName) {
					ChatService.promoteUser(this.roomId, obj._id).catch(({ response }) => {
						this.notificationsStore.enqueue("warning", "Error", response.data.message)
					});
					return ;
				}
			}
			this.notificationsStore.enqueue("warning", "Error", this.userName + " isn't a user of this room")
		},
		changePassword() {
			ChatService.updateChannel(this.roomId, this.newPassword).catch(({ response }) => {
				this.notificationsStore.enqueue("warning", "Error", response.data.message)
			});
			this.notificationsStore.enqueue("info", "Information", "New password for your channel")
		}
	}  
})
</script>