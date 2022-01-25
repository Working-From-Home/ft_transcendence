<template>
  <div>
    <chat-search-tmp></chat-search-tmp>
    <chat-component></chat-component>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ChatComponent from "../components/chat/ChatComponent.vue";
import ChatSearchTmp from "../components/chat/ChatSearchTmp.vue";

@Options({
  components: {
    ChatComponent,
    ChatSearchTmp,
  },
})
export default class Home extends Vue {

}
</script>