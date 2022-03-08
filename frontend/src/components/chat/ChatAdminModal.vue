<template>
	<div>
		<div class="modal fade text-black" id="adminModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Admin Modal</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<form @submit.prevent="">
						<div class="modal-body">
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
								<label for="userName" class="text-black">User Name</label>
								<button type="submit" class="btn btn-outline-warning" @click="Admin">Admin</button>
								<button type="submit" class="btn btn-outline-warning" @click="muted">Mute</button>
								<button type="submit" class="btn btn-outline-danger" @click="baned">Ban</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="modal fade text-black" id="timeModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title">Time</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
				<form @submit.prevent="">
					<div class="modal-body">
						<div class="input-group mb-4">
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
import { toNumber } from '@vue/shared';

export default defineComponent({
	props: {
		currentUserId: {type: Number, required: true},
		roomId: {type: Number, required: true},
	},
	data() {
		return {
			userName: '' as string,
			results: [] as any,
			userTarget: {} as any,
			timeModal: {} as Modal,
			action: null as ("ban" | "mute" | "admin" | null),
			time: new Date() as Date,
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
			ChatService.searchUsersByTitle(this.userName, this.roomId).then((resp: any) => {
				for (const obj of resp) {
					if (obj.id != this.currentUserId)
					  this.results = this.results.concat(obj);
				}
			});
		},
		muted() {
			if (!this.userName) {
				alert("please put a name")
				return ;
			}
			let results = JSON.parse(JSON.stringify(this.results))
			for (const obj of results) {
				if (obj.username === this.userName) {
					this.userTarget = obj;
					this.action = "mute";
					this.timeModal.show();
					return ;
				}
				
			}
			alert(this.userName + " isn't a user in the room")
		},
		baned() {
			if (!this.userName) {
				alert("please put a name")
				return ;
			}
			let results = JSON.parse(JSON.stringify(this.results))
			for (const obj of results) {
				if (obj.username === this.userName) {
					this.userTarget = obj;
					this.action = "ban";
					this.timeModal.show();
					return ;
				}
			}
			alert(this.userName + " isn't a user in the room")
		},
		submitTime() {
			console.log("time", this.time)
			console.log("this.userTarget", this.userTarget)
			if (this.action === "mute")
				ChatService.muteUser(this.roomId, this.userTarget._id, this.time).catch((err) => {
				alert(err.response);
			});
			if (this.action === "ban")
				ChatService.banUser(this.roomId, this.userTarget._id, this.time).catch((err) => {
				alert(err.response);
			});
			this.timeModal.hide();
		},
		Admin() {
			alert(this.userName + " is now admin")
		}
	}  
})
</script>