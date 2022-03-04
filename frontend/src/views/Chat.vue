<template>
  <div class="col-md-8 offset-md-2 gy-5">
    <chat-search></chat-search>
    <chat-component ></chat-component>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ChatComponent from "../components/chat/ChatComponent.vue";
import ChatSearch from "../components/chat/ChatSearch.vue";

@Options({
  components: {
    ChatComponent,
    ChatSearch,
  },
})
export default class Chat extends Vue {

}
</script>