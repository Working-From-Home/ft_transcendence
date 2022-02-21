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
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from '@vue/runtime-core';
import { ISearchChannel } from 'shared/models/socket-events';
import ChatService from "../../services/ChatService";

export default defineComponent({
  name: 'ChatSearchTmp',
  data(){
    return {
      searchTerm: '',
      results: [] as ISearchChannel[]
    }
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
				ChatService.joinChannel(obj["id"]).then( resp => {
					console.log(resp)
				}).catch( err => {
					console.log(err)
				})
				return ;
			}
		}
		alert("This channel doesn't exist")
    }
  },
  computed:{
    created() {}
  },
})

</script>

<style></style>
