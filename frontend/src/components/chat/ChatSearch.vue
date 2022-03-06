<template>
  <div>
      <form @submit.prevent="joinChannel">
		  <div class="row text-black">
			<div class="col-9">
				<input
					v-model="searchTerm"
					@input="searchChannels()"
					type="search"
					placeholder="Search channels"
					class="form-control form-control-lg"
					list="my-list-id"
				/>
				<datalist id="my-list-id">
					<option v-for="result in results" :key="result.id">
						{{ result.title }}
					</option>
				</datalist>
			</div>
			<button type="submit" class="col btn btn-outline-primary">Add Channel</button>
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
import { computed, defineComponent } from '@vue/runtime-core';
import { ISearchChannel } from 'shared/models/socket-events';
import ChatService from "../../services/ChatService";
import { Modal } from "bootstrap";

export default defineComponent({
  name: 'ChatSearchTmp',
  data(){
    return {
      searchTerm: '',
      results: [] as ISearchChannel[],
	  passwordModal: {} as Modal,
	  passWord: '' as String,
	  joinPrivateRoom: {} as ISearchChannel,
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
			alert("pls put a nama")
			return
		}
		let results = JSON.parse(JSON.stringify(this.results))
		for (const obj of results) {
			if (obj["title"] === this.searchTerm) {
				if (obj["password"] != null){
					this.joinPrivateRoom = obj;
					this.passwordModal.show();
				}
				else{
					ChatService.joinChannel(obj["id"], {password: null}).then( resp => {
						console.log(resp)
					}).catch(error => {
						console.log("err", error.response)
						alert(error.response)
					});
				}
				return ;
			}
		}
		alert("This channel doesn't exist")
    },
	joinChannelpassword(){
		if (this.passWord){
			ChatService.joinChannel(this.joinPrivateRoom.id, {password: this.passWord}).then( resp => {
				if (resp.data === '')
					alert("Wrong password")
				else
					this.passwordModal.hide()
			});
		}
	}
  },
})

</script>

<style></style>
