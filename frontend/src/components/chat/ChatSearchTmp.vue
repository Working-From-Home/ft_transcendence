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
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from '@vue/runtime-core';
import { ISearchChannel } from 'shared/models/socket-events'

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
      this.$socketapp.emit('searchChannel', this.searchTerm, (resp: ISearchChannel[]) => {
        this.results = resp
      });
    }
  },
  computed:{
    created() {}
  },
})

</script>

<style></style>
