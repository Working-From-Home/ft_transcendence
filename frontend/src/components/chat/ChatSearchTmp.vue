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
			<option v-for="result in results">{{ result }}</option>
		</datalist>
		<button type="button" class="btn btn-outline-primary">Add Channel</button>
      </div>
    <ul >
      <li class="list-group-item">A second item</li>
    </ul>
  </div>
</template>

        <!-- <button type="submit" class="input-group-text btn-success">
          <i class="bi bi-search me-2"></i> Search
        </button> -->
      <!-- <li class="list-group-item">And a fifth one</li> -->
  <!-- <li class="list-group-item active" aria-current="true">An active item</li> -->
<!-- https://d8devs.com/vue3-global-socket-io-installation-in-all-components/ -->

<script lang='ts'>
import { computed, defineComponent } from '@vue/runtime-core';
import { ISearchChannel } from 'shared/models/socket-events'

export default defineComponent({
  name: 'ChatSearchTmp',
  data(){
    return {
      searchTerm: '',
      results: []
    }
  },
  methods: {
    searchChannels() {
      console.log("results for  " , this.searchTerm);
      let test = this.$socketapp.emit('searchChannel', this.searchTerm ,(resp: any) => {
		this.results = resp;
        console.log("The result:", resp);
      });
	  console.log("The test:", test);
    }
  },
  computed:{
    created() {}
  },
})

</script>

<style></style>
