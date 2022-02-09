<template>
  <div>
      <div class="input-group mb-3">
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
		<button type="button" class="btn btn-outline-primary">Add Channel</button>
      </div>
     <input
      v-model="newChanneltitle"
      placeholder="title" class="form-control form-control-lg" list="my-list-id"
        />
      <button type="button" class="btn btn-outline-primary" @click="createChannel">Create</button>
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
      newChanneltitle: '',
      results: [] as ISearchChannel[]
    }
  },
  methods: {
    searchChannels() {
      ChatService.searchChannels(this.searchTerm).then((resp) => {
        this.results = resp;
      });
    },
    createChannel() {
      if (!this.newChanneltitle)
      {
        alert("pls put a ")
        return
      }
      ChatService.createChannel({title: this.newChanneltitle}).then( resp =>
      // ChatService.createChannel({title: "fege"}).then( resp =>
      {
        console.log(resp)
      }).catch( err =>
      {
        console.log(err)
      })
    }
  },
  computed:{
    created() {}
  },
})

</script>

<style></style>
