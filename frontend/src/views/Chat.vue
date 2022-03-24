<template>
  <div class="col-md-8 offset-md-2 gy-5">
    <chat-search></chat-search>
    <chat-component ></chat-component>
  </div>
</template>

<script lang="ts">
import ChatComponent from "../components/chat/ChatComponent.vue";
import ChatSearch from "../components/chat/ChatSearch.vue";
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    ChatComponent,
    ChatSearch,
  },
});
</script>