<template>
	<section>
		<button type="button" id="btn-front" class="btn-front btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
			Add a New Channel
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
				<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
				<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
			</svg>
		</button>
		<div class="modal fade text-black" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="staticBackdropLabel">New Channel</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<form @submit.prevent="createChannel">
						<div class="modal-body">
								<div class="form-floating mb-3">
									<input type="text" class="form-control" id="ChannelName" placeholder="name" v-model.trim="ChannelName">
									<label for="ChannelName">Channel Name:</label>
								</div>
								<div class="form-floating mb-2">
									<input type="text" class="form-control" id="password" placeholder="name" v-model.trim="password">
									<label for="password">Password (optionel):</label>
								</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Create channel</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang='ts'>
import { computed, defineComponent } from '@vue/runtime-core';
import ChatService from "../../services/ChatService";

export default defineComponent({
  data(){
    return {
      password: '',
      ChannelName: '',
    }
  },
  methods: {
    createChannel() {
		if (!this.ChannelName) {
			alert("pls put a name")
			return
		}
		ChatService.createChannel({title: this.ChannelName}).then( resp =>{
			console.log(resp)
		}).catch( err => {
			console.log(err)
		})
    }
  }
})

</script>

<style>
#btn-front {
	margin: 1em;
	max-width: 100%;
}
</style>