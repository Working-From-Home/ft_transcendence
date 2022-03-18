<template>
  <div>
	  <module-toast :title="toastProps.title" :message="toastProps.message"/>
      <form @submit.prevent="joinChannel">
		  <div class="row text-black">
			<div class="col-9">
				<input
					v-model="searchTerm"
					@input="searchChannels()"
					type="search"
					placeholder="search for a channel"
					class="form-control form-control-lg border-secondary"
					list="my-list-id"
				/>
				<datalist id="my-list-id">
					<option v-for="result in results" :key="result.id">
						{{ result.title }}
					</option>
				</datalist>
			</div>
			<button type="submit" class="col btn btn-outline-secondary">Join</button>
		  </div>
	   </form>

	   <!--   Password Modal  -->
	   <div class="modal fade text-black" id="passwordModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Password required</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<form @submit.prevent="joinChannelpassword">
					<div class="modal-body">
						<div class="form-floating mb-4">
							<input
							v-model="passWord"
							type="password"
							class="form-control"
							id="passWord"
							placeholder=""
							required
							/>
							<label for="passWord" class="text-black">Password</label>
						</div>
					</div>
					<div class="modal-footer">
						<button type="submit" class="btn btn-primary">Submit</button>
					</div>
				</form>
			</div>
		</div>
	   </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from '@vue/runtime-core';
import { ISearchChannel } from 'shared/models/socket-events';
import ChatService from "../../services/ChatService";
import { Modal, Toast } from "bootstrap";
import moduleToast from './Toast.vue';

export default defineComponent({
  components: {
		moduleToast
	},
  name: 'ChatSearchTmp',
  data(){
    return {
      searchTerm: '' ,
      results: [] as ISearchChannel[],
	  passwordModal: {} as Modal,
	  passWord: '' as string,
	  joinPrivateRoom: {} as ISearchChannel,
	  toast: {} as Toast,
	  toastProps: {
		  message: '' as string,
		  title: '' as string,
	  }
    }
  },
  mounted() {
		this.passwordModal = new Modal("#passwordModal");
  },
  methods: {
    searchChannels() {
      ChatService.searchChannels(this.searchTerm).then((resp) => {
        this.results = resp;
      });
    },
    joinChannel() {
		if (!this.searchTerm) {
			alert("please put a name")
			return
		}
		let results = JSON.parse(JSON.stringify(this.results))
		for (const obj of results) {
			if (obj["title"] === this.searchTerm) {
				if (obj.isPassword){
					this.joinPrivateRoom = obj;
					this.passwordModal.show();
				}
				else{
					ChatService.joinChannel(obj["id"], {password: null}).catch(({ response }) => {
						this.toast = new Toast("#toastModal");
						this.toastProps.message = response.data.message;
						this.toastProps.title = "Error";
						this.toast.show();
					});
				}
				return ;
			}
		}
		this.toast = new Toast("#toastModal");
		this.toastProps.message = "This channel doesn't exist";
		this.toastProps.title = "Error";
		this.toast.show();
    },
	joinChannelpassword(){
		if (this.passWord){
			ChatService.joinChannel(this.joinPrivateRoom.id, {password: this.passWord}).then( resp => {
				this.passwordModal.hide()
			}).catch(({ response }) => {
				this.toast = new Toast("#toastModal");
				this.toastProps.message = response.data.message;
				this.toastProps.title = "Error";
				this.toast.show();
			});
		}
	},
  },
})

</script>
